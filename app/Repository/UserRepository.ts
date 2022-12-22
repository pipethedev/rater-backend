import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { Register } from 'App/Types'
import { injectable } from 'tsyringe'

@injectable()
export default class UserRepository {
  public async create(data: Register, transaction: TransactionClientContract): Promise<User> {
    return await User.create(data, { client: transaction });
  }
  public async findByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }

  public async findbyVerificationToken(token: string): Promise<User | null> {
    return await User.query()
      .where('account_verify_token', token)
      .where('account_verify_expires', '<', new Date(Date.now() + 10 * 60 * 1000))
      .first()
  }

  public async updateOne(
    id: string,
    data: Partial<User>,
    transaction: TransactionClientContract
  ): Promise<User> {
    return await User.query({ client: transaction }).where('id', id).update(data).first()
  }
}
