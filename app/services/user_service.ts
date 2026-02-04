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
}