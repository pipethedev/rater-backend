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

class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }
}

class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public cause: Error | undefined

  constructor(statusCode: number, message, cause?: any, isOperational = true) {
    super(message)

    this.statusCode = statusCode
    this.cause = cause as Error
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export { ExceptionHandler, AppError }
