import User from "#models/user"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"

@inject()
export class UserService {
  constructor(
    protected ctx: HttpContext
  ) {}

  all() {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Mary' },
      { id: 3, name: 'Samuel' },
    ]

    return users
  }

  allDbUsers() {
    // console.log(this.ctx.auth.user) // return users from db
  }

  async createUser(payload: any) {
    const user = await User.create(payload)

    return user
  }

  public async fetchUsers() {
    const users = await User.all()

    return users
  }

  async fetchUser(userId: number) {
    const user = await User.findOrFail(userId)

    return user
  }

  async updateUser(payload: any, id: number) {
    const user = await User.findOrFail(id)

    user?.merge(payload).save()

    return user
  }

  async deleteUser(id: number) {
    const user = await User.findOrFail(id)

    user?.delete()
  }
}