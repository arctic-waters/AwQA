import { v4 } from 'uuid'

import { Application, Location, QueuePosition } from '.'

export class User {
  public readonly uuid: string = v4()

  public readonly id: number = ((min: number, max: number) =>
    Math.random() * (max - min) + min)(1000, 9999)

  public name: string = 'User'

  public get locationsQueued(): Location[] {
    const locations: Location[] = []

    for (const location of this.app.locations) {
      if (location.queue.some((v) => v.user.uuid === this.uuid))
        locations.push(location)
    }

    return locations
  }

  public get locationsWaiting(): Location[] {
    const locations: Location[] = []

    for (const location of this.app.locations) {
      if (location.waiting.some((v) => v.user.uuid === this.uuid))
        locations.push(location)
    }

    return locations
  }

  public get locationsCurrent(): Location[] {
    const locations: Location[] = []

    for (const location of this.app.locations) {
      if (location.current.some((v) => v.uuid === this.uuid))
        locations.push(location)
    }

    return locations
  }

  public get positions(): { location: Location; position: QueuePosition }[] {
    const locations = this.locationsQueued
    const positions: { location: Location; position: QueuePosition }[] = []

    for (const location of locations) {
      positions.push({
        location,
        position: location.queue.find((v) => v.user.uuid === this.uuid)!!,
      })
    }

    return positions
  }

  public get waitingTimes(): { timeout: Date; location: Location }[] {
    const locations = this.locationsWaiting
    const waitingTimes: { timeout: Date; location: Location }[] = []

    for (const location of locations) {
      waitingTimes.push({
        location,
        timeout: location.waiting.find((v) => v.user.uuid === this.uuid)!!
          .timeout,
      })
    }

    return waitingTimes
  }

  constructor(private app: Application) {}
}
