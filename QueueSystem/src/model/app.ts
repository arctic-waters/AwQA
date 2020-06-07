import { Location, User } from '.'

export class Application {
  public locations: Location[] = []
  public users: User[] = []

  public createLocation(options: {
    name: string
    description: string
    capacity: number
    window: number

    location: [number, number]
  }): Location {
    const location = new Location()
    location.description = options.description
    location.name = options.name
    location.capacity = options.capacity
    location.window = options.window

    location.locX = options.location[0]
    location.locY = options.location[1]

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
