import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import { ChangePassword, CreateWorker, UpdateUser } from 'App/Types'
import UserService from 'App/Services/UserService'
import { container } from 'tsyringe'
import AppError from 'App/Helpers/error'

export default class UsersController {
  private userService: UserService = container.resolve(UserService)

  public async me({ auth }: HttpContextContract) {
    const { email } = auth.user!
    const user = await this.userService.findUserbyEmail(email);
    return SuccessResponse('User profile fetched', user)
  }

  public async updateProfile({ auth, request, response }: HttpContextContract) {
    try {
      const { id } = auth.user! // this is the authenticated user
      
      const body = request.body() as UpdateUser

      const result = await this.userService.updateProfile(id, body)

      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)

      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

      return response.internalServerError(ErrorResponse('We could not update your profile, try again later!'))
    }
  }

  public async changePassword({ auth, request, response}: HttpContextContract) {
    try {
      const body = request.body() as ChangePassword
      const result = await this.userService.changePassword(body, { auth })
      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)

      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

      return response.internalServerError(ErrorResponse('We could not update password, try again later!'))
    }
  }

  public async getAllUsers({ response, request }: HttpContextContract) {
    try {
      const type = request.qs().type as string
      const result = await this.userService.all(type);
      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)

      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

      return response.internalServerError(ErrorResponse('We could not fetch all users, try again later!'))
    }
  }

  public async createWorker({ request, response }: HttpContextContract) {
    try {
      const body = request.body() as CreateWorker

      const result = await this.userService.createWorker(body)

      return response.ok(result)
    } catch (error) {
      Logger.error(error.message)

      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

      return response.internalServerError(ErrorResponse('We could not create a worker, try again later!'))
    }
  }

  public async banUser({ request, response }: HttpContextContract) {
    try {
      const { banned } = request.body();

      const result = await this.userService.ban(request.param('userId') as string, banned)

      return response.ok(SuccessResponse(`This user has been ${banned ? 'de-activated' : 'activated' } successfully`, result))

    } catch (error) {
      Logger.error(error.message)

      if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

      return response.internalServerError(ErrorResponse('We could not ban user, try again later!'))
    }
  }
}
