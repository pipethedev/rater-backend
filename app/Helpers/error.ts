export default class AppError extends Error {
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
  