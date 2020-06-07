import { v4 } from 'uuid'

import { User, QueuePosition } from '.'

export class Location {
  public readonly uuid: string = v4()

  public readonly id: number = ((min: number, max: number) =>
    Math.random() * (max - min) + min)(1000, 9999)

  public name: string = 'Location'
  public description: string = 'No Description'

  public current: User[] = []
  public waiting: { timeout: Date; user: User }[] = []
  public queue: QueuePosition[] = []

  public capacity: number = 10
  public window: number = 10

  public addToQueue(user: User): void {
    this.queue.push(new QueuePosition(this, user))
    this.update()
  }

  public enter(user: User): void {
    if (!this.waiting.some((v) => v.user.uuid === user.uuid)) return

    this.waiting = this.waiting.filter((v) => v.user.uuid !== user.uuid)
    this.current.push(user)

    this.update()
  }

  public leave(user: User): void {
    this.current = this.current.filter((v) => v.uuid !== user.uuid)
    this.update()
  }

  public update(): void {
    const totalCount = this.current.length + this.waiting.length

    if (totalCount < this.capacity && this.queue.length > 0) {
      const next = this.queue.shift()!!

      this.waiting.push({
        timeout: new Date(new Date().getTime() + this.window * 60000),
        user: next.user,
      })

      return this.update()
    }

    for (const waitingUser of this.waiting) {
      if (waitingUser.timeout.getTime() > new Date().getTime()) continue

      this.waiting = this.waiting.filter((v) => v !== waitingUser)
      return this.update()
    }
  }
}
