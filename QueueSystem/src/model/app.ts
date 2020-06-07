import { Location, User } from '.'

export class Application {
  public locations: Location[] = []
  public users: User[] = []

  public createLocation(options: {
    name: string
    description: string
    capacity: number
    window: number
  }): Location {
    const location = new Location()
    location.description = options.description
    location.name = options.name
    location.capacity = options.capacity
    location.window = options.window

    this.locations.push(location)
    return location
  }

  public createUser(options: { name: string }): User {
    const user = new User(this)
    user.name = options.name

    this.users.push(user)
    return user
  }
}
