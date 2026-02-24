import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LogRequestMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Downstream logic: Log request before processing
    ctx.logger.info(`${ctx.request.method()}: ${ctx.request.url()}`)
    
    const output = await next()
    return output
  }
}