import { ObjectLiteral } from 'App/Types'
import httpStatus from 'http-status'
import Validator from 'validatorjs'

export const SuccessResponse = <T>(message: string, data: T) => {
  return {
    status: true,
    message,
    data,
  }
}

export const ErrorResponse = (message: string, errors?: any[]) => {
  return {
    success: false,
    message,
    errors,
  }
}

export const convertToKobo = (amount: number) => {
  return amount / 100;
}

const validate = (rules: ObjectLiteral, validationMessages?: ObjectLiteral) => {
  return async (ctx, next) => {
    const validation = new Validator(ctx.request.body(), rules, validationMessages)

    const errors: any = validation.errors.all()

    if (validation.fails()) {
      return ctx.response
        .status(httpStatus.BAD_REQUEST)
        .send(ErrorResponse('Your data is invalid', createValidationError(errors)))
    }

    await next()
  }
}

export default validate

export const createValidationError = (validationError: any[]) => {
  const errors: any[] = []

  for (const [key, value] of Object.entries(validationError)) {
    errors.push({
      field: key,
      message: value[0],
    })
  }

  return errors
}

export function convertoHex(str: string) {
  const arr: any[] = []
  for (let i = 0; i < str.length; i++) {
    arr[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + arr.join('\\u')
}
