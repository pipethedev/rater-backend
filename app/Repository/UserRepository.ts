import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { Register } from 'App/Types'
import { injectable } from 'tsyringe'

@injectable()
export default class UserRepository {
  public async create(data: Register, transaction: TransactionClientContract): Promise<User> {
    const user = new User()
    user.merge(data)
    user.useTransaction(transaction)
    return await user.save()
  }
  public async findByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }
  public async updateOne(
    id: string,
    data: Partial<User>,
    transaction: TransactionClientContract
  ): Promise<User> {
    const user = await User.query({ client: transaction }).where('id', id).firstOrFail()
    user.useTransaction(transaction)
    return await user.merge(data).save()
  }
}
