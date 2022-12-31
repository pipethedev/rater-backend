/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }
  public handle(error: any, ctx: HttpContextContract): any {
      console.log(error.message)
  }

  public report(error: any, ctx: HttpContextContract): void {
    Logger.error(error.message)
  }
}
export { ExceptionHandler }
