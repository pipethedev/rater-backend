import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { Roles } from 'App/Enum';
import User from 'App/Models/User'
import { CreateWorker, Register } from 'App/Types'
import { injectable } from 'tsyringe'

@injectable()
export default class UserRepository {

  public async create(data: Register | CreateWorker, transaction: TransactionClientContract): Promise<User> {
    return await User.create(data, { client: transaction });
  }

  public async findByID(id: string): Promise<User | null> {
    return await User.find(id)
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }

  public async findByPhoneNumber(phone: string): Promise<User | null> {
    return await User.findBy('phone_number', phone)
  }

  public async all(role?: Roles): Promise<User[]> {
    return role ? await User.query().where('role', role).preload('ratings') : await User.query().orderBy('created_at', 'desc')
  }

  public async findbyVerificationToken(token: string): Promise<User | null> {
    return await User.query()
      .where('account_verify_token', token)
      .where('account_verify_expires', '<', new Date(Date.now() + 10 * 60 * 1000))
      .first()
  }

  public async updateOne(id: string, data: Partial<User>, transaction: TransactionClientContract): Promise<User> {
    return await User.query({ client: transaction }).where('id', id).update(data).first()
  }
}
