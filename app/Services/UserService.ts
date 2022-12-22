import { SuccessResponse, convertoHex } from 'App/Helpers'
import User from 'App/Models/User'
import { createHash, randomBytes } from 'crypto'
import TokenRepository from 'App/Repository/TokenRepository'
import UserRepository from 'App/Repository/UserRepository'
import { Register, UpdateUser } from 'App/Types'
import { container } from 'tsyringe'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { AppError } from 'App/Exceptions/Handler'
import httpStatus from 'http-status'
import MailService from './MailService'
import Route from '@ioc:Adonis/Core/Route'

export default class UserService {
  public userRepository: UserRepository = container.resolve(UserRepository)
  public tokenRepository: TokenRepository = container.resolve(TokenRepository)
  public mailService: MailService = container.resolve(MailService)

  public async createUser(body: Register) {
    const trx = await Database.transaction()
    try {
      const check = await this.userRepository.findByEmail(body.email)
      if (check) throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists')
      const token = randomBytes(32).toString('hex') as string
      await this.tokenRepository.create({ email: body.email, token }, trx)
      const user = await this.userRepository.create(body, trx)
      const url = Route.makeUrl('verifyEmail', { token })
      await Promise.all([
        this.generateVerifyTokenForUser({ token, userId: user.id }, trx),
        this.mailService.send(body.email, 'Welcome aboard !', 'emails/verify', {
          name: `${user.last_name} ${user.first_name}`,
          url,
        }),
      ])
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
    { token, userId }: { token: string; userId: string },
    trx: TransactionClientContract
  ): Promise<string> {
    const newToken = convertoHex(token)
    const accountVerifyToken = createHash('sha256').update(newToken).digest('hex')

    await this.userRepository.updateOne(
      userId,
      {
        account_verify_token: accountVerifyToken,
        account_verify_expires: new Date(Date.now() + 10 * 60 * 1000),
      },
      trx
    )

    return token
  }

  public async resendVerificationEmail(email: string) {
    const trx = await Database.transaction()
    try {
      const token = randomBytes(32).toString('hex') as string
      // create user
      const { id } = await this.userRepository.findByEmail(email) as User

      // generate verification token
      const verifyToken = await this.generateVerifyTokenForUser({ token, userId: id }, trx)

      const link = Route.makeUrl('verifyEmail', { token: verifyToken })

      //send token to user mail for verification
      await this.mailService.send(email, 'Verify your email', 'emails/verify', { link })

      // return user, token and their setting
      return SuccessResponse('Verification email sent', null)
    } catch (error) {
      trx.rollback()
      throw error
    }
  }
}
