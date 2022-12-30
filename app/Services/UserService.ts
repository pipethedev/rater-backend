import { SuccessResponse } from 'App/Helpers'
import User from 'App/Models/User'
import * as passwordGenerator from "secure-random-password"
import { createHash, randomBytes } from 'crypto'
import UserRepository from 'App/Repository/UserRepository'
import { ChangePassword, CreateWorker, Register, ResetPassword, UpdateUser } from 'App/Types'
import { container } from 'tsyringe'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { AppError } from 'App/Exceptions/Handler'
import httpStatus from 'http-status'
import MailService from './MailService'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import { PasswordAction, Roles } from 'App/Enum'

export default class UserService {
  public userRepository: UserRepository = container.resolve(UserRepository)
  public mailService: MailService = container.resolve(MailService)

  async findUserbyEmail(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'User with this email address does not exist')
    return user;
  }

  public async all() {
    const users = await this.userRepository.all()
    return SuccessResponse("All users fetched successfully", users)
  }

  public async createUser(body: Register) {
    const trx = await Database.transaction()
    try {
      const emailCheck = await this.userRepository.findByEmail(body.email) as User

      if(emailCheck) throw new AppError(httpStatus.BAD_REQUEST, 'User with this email address already exist')

      const phoneCheck = await this.userRepository.findByPhoneNumber(body.phone_number) as User

      if(phoneCheck) throw new AppError(httpStatus.BAD_REQUEST, 'User with this phone number already exist')

      const user = await this.userRepository.create(body, trx)

      const token = await this.generateTokenForUser(user.id, trx)

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
      await trx.rollback()
      throw error
    }
  }

  public async createWorker (body: CreateWorker) {
    const trx = await Database.transaction()
    try {
      const password = passwordGenerator.randomPassword({ length: 8, characters: [passwordGenerator.lower, passwordGenerator.upper, passwordGenerator.digits] })

      const worker = await this.userRepository.create({ ...body, password, role: Roles.MANAGER }, trx)

      await this.mailService.send(body.email, 'Welcome aboard !', 'emails/worker', { ...worker, password })

      await trx.commit()

      return SuccessResponse<User>('Worker created successfully', worker)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async updateProfile(id: string, body: UpdateUser) {
    const trx = await Database.transaction()
    try {
      await this.findUserbyEmail(body.email);
      const update = await this.userRepository.updateOne(id, body, trx)
      await trx.commit()
      return SuccessResponse<User>('User profile updated successfully', update)
    } catch (error: any) {
      await trx.rollback()
      throw error
    }
  }

  public async ban(userId: string) {
    const trx = await Database.transaction()
    try {
      const user = await this.userRepository.findByID(userId) as User
      const update = await this.userRepository.updateOne(user.id, { 
        banned: true,
        banned_at: new Date()
      }, trx)
      await trx.commit()
      if(update) return SuccessResponse<User>('This user has been banned successfully', update)
    } catch (error: any) {
      await trx.rollback()
      throw error
    }
  }

  public async recover(email: string) {
    const trx = await Database.transaction()
    try {
      // get user by the provided email
      const user = await this.findUserbyEmail(email)

      // Generate the random reset token
      const resetToken = await this.generateTokenForUser(user.id, trx)

      const url = Env.get('FRONTEND_URL') + `/reset/${resetToken}`

      // Send it to user's email
      await this.mailService.send(user.email, "Reset password", "emails/reset", {
        ...(user.toJSON()),
        url
      })

      await trx.commit()

      return SuccessResponse("A reset password link has been sent, check your mail", null)
    } catch (error) {
      trx.rollback()
      throw error
    }
  }

  public async reset(token: string, { password }: ResetPassword) {
    const trx = await Database.transaction()
    try {
      const user = await this.findUserByToken(token, PasswordAction.PasswordReset)


      const update = await this.userRepository.updateOne(user.id, {
        password: await Hash.make(password),
        account_verify_expires: null,
        account_verify_token: null
      }, trx)

      await trx.commit()

      if(update) return SuccessResponse("Password updated successfully", null)
    } catch (error){
      await trx.rollback()
      throw error
    }
  }

  public async findUserByToken(token: string, action: PasswordAction): Promise<User> {
    const accountVerifyToken = createHash('sha256').update(token).digest('hex')

    const user = await this.userRepository.findbyVerificationToken(accountVerifyToken)

    if (!user) throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${action == PasswordAction.PasswordReset ? PasswordAction.PasswordReset : PasswordAction.PasswordVerification } token`)
    return user
  }

  public async generateTokenForUser(userId: string,  trx: TransactionClientContract): Promise<string> {
    try {
      const token = randomBytes(32).toString('hex') as string
      const accountVerifyToken = createHash('sha256').update(token).digest('hex')
  
      await this.userRepository.updateOne(userId,{
        account_verify_token: accountVerifyToken,
        account_verify_expires: new Date(Date.now() + 10 * 60 * 1000),
      }, trx)
      await trx.commit()
      return token
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async resendVerificationEmail(email: string) {
    const trx = await Database.transaction()
    try {
      // create user
      const user = await this.findUserbyEmail(email)

      // generate verification token
      const token = await this.generateTokenForUser(user.id, trx)

      const url =  Env.get('APP_URL') + Route.makeUrl('verifyEmail', { token })

      //send token to user mail for verification
      await this.mailService.send<Partial<User> & { url: string}>(email, 'Verify your email', 'emails/verify', { url, ...user.toJSON() })

      await trx.commit()

      // return user, token and their setting
      return SuccessResponse('Verification email sent', null)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async changePassword (body: ChangePassword, { auth }) {
    const trx = await Database.transaction()
    try {
      const { email } = auth.user!
      const user = await this.findUserbyEmail(email);


      const verify = await Hash.verify(user.password, body.old_password);
      if(!verify) throw new AppError(httpStatus.UNAUTHORIZED, "Invalid old password provided")

      const update = await this.userRepository.updateOne(user.id, {
        password: await Hash.make(body.password)
      }, trx)

      await trx.commit()

      if(update) return SuccessResponse("User password updated successfully", null)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
