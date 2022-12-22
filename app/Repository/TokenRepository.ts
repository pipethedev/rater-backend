import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import VerificationToken from 'App/Models/VerificationToken'
import { Token } from 'App/Types'
import { injectable } from 'tsyringe'

@injectable()
export default class TokenRepository {
  public async create(
    data: Token,
    transaction: TransactionClientContract
  ): Promise<VerificationToken> {
    const token = new VerificationToken()
    token.merge(data)
    token.useTransaction(transaction)
    return await token.save()
  }
}
