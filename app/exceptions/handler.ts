import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The container request for the current HTTP context
   */
  protected container = app.container

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    // Format validation errors from validator
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return ctx.response.status(422).send({
        errors: error.messages,
      })
    }

    // Handle generic HTTP exceptions
    if (error.status && error.code) {
      return ctx.response.status(error.status).send({
        errors: [{ message: error.message, code: error.code }],
      })
    }

    // Handle unexpected exceptions
    return ctx.response.status(error.status || 500).send({
      errors: [{ message: error.message || 'Internal Server Error' }],
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
