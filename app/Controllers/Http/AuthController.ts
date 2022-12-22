import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import { Register } from 'App/Types'
import httpStatus from 'http-status'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import AuthService from 'App/Services/AuthService'

export default class AuthController {
  private userService: UserService = container.resolve(UserService)
  public authService: AuthService = container.resolve(AuthService)

  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const body = request.body() as Register
      const result = await this.authService.login(body, { auth })
      return response.status(httpStatus.OK).send(result)
    } catch (error) {
      Logger.error(error.message)
      return response.status(httpStatus.BAD_REQUEST).send(error.message)
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const body = request.body() as Register
      const result = await this.userService.createUser(body)
      return response.status(httpStatus.CREATED).send(result)
    } catch (error: any) {
      Logger.error(error.message)
      return response.status(httpStatus.BAD_REQUEST).send(error.message)
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(httpStatus.OK)
  }
}
