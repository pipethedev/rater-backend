import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import { ForgotPassword, Register, ResetPassword } from 'App/Types'
import { OK } from 'http-status'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import AuthService from 'App/Services/AuthService'
import { ErrorResponse } from 'App/Helpers'
import MailService from 'App/Services/MailService'
import Env from '@ioc:Adonis/Core/Env'
import { PasswordAction } from 'App/Enum'
import AppError from 'App/Helpers/error'

export default class AuthController {
  private userService: UserService = container.resolve(UserService)
  public authService: AuthService = container.resolve(AuthService)
  public mailService: MailService = container.resolve(MailService)

  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const body = request.body() as Register
      const result = await this.authService.login(body, { auth })
      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)
      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
      return response.internalServerError(ErrorResponse('Unable to login at the moment try again later'))
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const body = request.body() as Register

      const result = await this.userService.createUser(body)

      return response.ok(result)
    } catch (error: any) {
      Logger.error(error.message)
      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
      return response.internalServerError(ErrorResponse('We could not create your account'))
    }
  }

  public async verifyUserEmail({ request, response }: HttpContextContract) {
    try {
      // Get user based on the token
      const user = await this.userService.findUserByToken(request.param('token'), PasswordAction.PasswordVerification)

      // 2) If there is a user, set the new password
      await this.authService.verifyUser(user.id)

      return response.location(Env.get('FRONTEND_URL') + '/login').send('Email verified successfully')
    } catch (error) {
      Logger.error(error.message)
      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
      return response.internalServerError(ErrorResponse('We could not verify your email'))
    }
  }

  public async forgotPassword({ request, response }: HttpContextContract) {
    try {
      const body = request.body() as ForgotPassword

      const result = await this.userService.recover(body.email)
      
      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)
      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
      return response.internalServerError(ErrorResponse('We could not send password forgot link!'))
    }
  }

  public async resendVerification({ request, response }: HttpContextContract) {
    try {
      const { email } = request.body()
      const result = await this.userService.resendVerificationEmail(email)
      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)
      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
      return response.internalServerError(ErrorResponse('We could not resend your verification email'))
    }
  }

  public async resetPassword({ auth, request, response }: HttpContextContract){
    try {
      const body = request.body() as ResetPassword

      const result = await this.userService.reset(request.param('token'), body)

      auth.use('api').revoke()

      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)
      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
      return response.internalServerError(ErrorResponse('We could not reset your password, try again !'))
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await Promise.all([ 
      auth.logout(),
      auth.use('api').revoke()
    ])
    return response.status(OK)
  }
}
