import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import User from 'App/Models/User'
import UserRepository from 'App/Repository/UserRepository'
import { container } from 'tsyringe'

export default class Banned {
  protected userService: UserRepository = container.resolve(UserRepository)
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const { id } = auth.user!
    const { banned, banned_at } = await this.userService.findByID(id) as User
    if(banned && banned_at !== null) throw new UnAuthorizedException('Your account has been banned, please contact support or administrator')
    await next()
  }
}
