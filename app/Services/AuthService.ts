import { Login } from 'App/Types'
import { container, injectable } from 'tsyringe'
import Hash from '@ioc:Adonis/Core/Hash'
import UserRepository from 'App/Repository/UserRepository'
import { UNAUTHORIZED } from 'http-status'
import { SuccessResponse } from 'App/Helpers'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import AppError from 'App/Helpers/error'
import { Roles } from 'App/Enum'

@injectable()
export default class AuthService {
  private userRepository: UserRepository = container.resolve(UserRepository)

  public async login(body: Login, { auth }) {
    const { email, password } = body

    const user = await this.userRepository.findByEmail(email) as User

    if(user.banned && user.banned_at !== null) throw new AppError(UNAUTHORIZED, 'Your account has been de-activated, please contact support')
    // Verify password
    if (!(await Hash.verify(user?.password as string, password))) throw new AppError(UNAUTHORIZED, 'Invalid credentials')
    // Generate token
    const token = await auth.use('api').attempt(email, password)

    const index = Object.values(Roles).indexOf(user.role as Roles);
    const role =  Object.keys(Roles)[index];

    return SuccessResponse('Login successful', {
      role,
      ...token.toJSON()
    })
  }


  public async verifyUser(id: string): Promise<User> {
    const trx = await Database.transaction()
    try {
      const user = await this.userRepository.updateOne(id,{
        account_verify_token: null,
        account_verify_expires: null,
        email_verified_at: new Date(),
      },trx)
      await trx.commit()
      return user
    } catch (error) {
      trx.rollback()
      throw error
    }
  }

}
