import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import httpStatus from 'http-status'
import { UpdateUser } from 'App/Types'
import UserService from 'App/Services/UserService'
import { container } from 'tsyringe'

export default class UsersController {
  private userService: UserService = container.resolve(UserService)
  public async me({ auth }: HttpContextContract) {
    return SuccessResponse("User profile fetched", auth.user!)
  }

  public async updateProfile({ auth, request, response }: HttpContextContract) {
    try {
      const { id } = auth.user!; // this is the authenticated user
      const body = request.body() as UpdateUser
      const result = await this.userService.updateProfile(id, body)
      return response.status(httpStatus.OK).send(result)
    } catch (error) {
      Logger.error(error.message)
      return response.status(httpStatus.BAD_REQUEST).send(error.message)
    }
  }

  public async changePassword() {}

  public async getAllUsers() {}
}
