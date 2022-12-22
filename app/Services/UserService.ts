import { SuccessResponse } from 'App/Helpers'
import User from 'App/Models/User'
import { createHash, randomBytes } from 'crypto'
import UserRepository from 'App/Repository/UserRepository'
import { Register, UpdateUser } from 'App/Types'
import { container } from 'tsyringe'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { AppError } from 'App/Exceptions/Handler'
import httpStatus from 'http-status'
import MailService from './MailService'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'

export default class UserService {
  public userRepository: UserRepository = container.resolve(UserRepository)
  public mailService: MailService = container.resolve(MailService)

  public async createUser(body: Register) {
    const trx = await Database.transaction()
    try {
      const check = await this.userRepository.findByEmail(body.email)
      if (check) throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists')
      const user = await this.userRepository.create(body, trx)
      const token = await this.generateVerifyTokenForUser(user.id, trx)
      const url = Route.makeUrl('verifyEmail', { token })
      await this.mailService.send(body.email, 'Welcome aboard !', 'emails/verify', {
        ...(user.toJSON()),
        url: Env.get('APP_URL') + url,
      })
      await trx.commit()
      return SuccessResponse<User>(
        'User registered successfully, check your email for verification',
        user
      )
    } catch (error: any) {
      console.log(error)
      await trx.rollback()
      throw error
    }
  }

  public async updateProfile(id: string, body: UpdateUser) {
    const trx = await Database.transaction()
    try {
      const user = await this.userRepository.updateOne(id, body, trx)
      await trx.commit()
      return SuccessResponse<User>('User profile updated successfully', user)
    } catch (error: any) {
      await trx.rollback()
      throw error
    }
  }

  public async generateVerifyTokenForUser(
    userId: string,
    trx: TransactionClientContract
  ): Promise<string> {
    const verifyToken = randomBytes(32).toString('hex') as string
    const accountVerifyToken = createHash('sha256').update(verifyToken).digest('hex')

    await this.userRepository.updateOne(
      userId,
      {
        account_verify_token: accountVerifyToken,
        account_verify_expires: new Date(Date.now() + 10 * 60 * 1000),
      },
      trx
    )

    return verifyToken
  }

  public async resendVerificationEmail(email: string) {
    const trx = await Database.transaction()
    try {
      // create user
      const user = await this.userRepository.findByEmail(email) as User
      if (!user) throw new AppError(httpStatus.NOT_FOUND, 'Invalid email address provided')

      // generate verification token
      const token = await this.generateVerifyTokenForUser(user.id, trx)

      const url =  Env.get('APP_URL') + Route.makeUrl('verifyEmail', { token })

      //send token to user mail for verification
      await this.mailService.send<Partial<User> & { url: string}>(email, 'Verify your email', 'emails/verify', { url, ...user.toJSON() })

      // return user, token and their setting
      return SuccessResponse('Verification email sent', null)
    } catch (error) {
      trx.rollback()
      throw error
    }
  }
}
