import { Location, User } from '.'

export class QueuePosition {
  public get position(): number {
    return this.location.queue.indexOf(this) + 1
  }

  constructor(public readonly location: Location, public readonly user: User) {}
}
