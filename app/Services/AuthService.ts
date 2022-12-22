import { Login } from 'App/Types'
import { container, injectable } from 'tsyringe'
import Hash from '@ioc:Adonis/Core/Hash'
import UserRepository from 'App/Repository/UserRepository'
import { AppError } from 'App/Exceptions/Handler'
import httpStatus from 'http-status'
import { SuccessResponse } from 'App/Helpers'
import { createHash } from 'crypto'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

@injectable()
export default class AuthService {
  private userRepository: UserRepository = container.resolve(UserRepository)

  public async login(body: Login, { auth }) {
    const { email, password } = body
    const user = await this.userRepository.findByEmail(email)
    // Verify password
    if (!(await Hash.verify(user?.password as string, password))) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials')
    }
    // Generate token
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '24hours',
    })

    return SuccessResponse('Login successful', token.toJSON())
  }

  public async getUserByVerificationToken(token: string): Promise<User> {
    const accountVerifyToken = createHash('sha256').update(token).digest('hex')

    const user = await this.userRepository.findbyVerificationToken(accountVerifyToken)

    if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid verification token')
    return user
  }

  public async verifyUser(id: string): Promise<User> {
    const trx = await Database.transaction()
    try {
      const user =  await this.userRepository.updateOne(id, {
        account_verify_token: null,
        account_verify_expires: null,
        email_verified_at: new Date(),
      }, trx)
      trx.commit()
      return user
    } catch (error) {
      trx.rollback()
      throw error
    }
  }
}
