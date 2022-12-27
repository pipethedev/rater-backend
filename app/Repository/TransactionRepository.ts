import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import Transaction from "App/Models/Transaction";
import { injectable } from "tsyringe";

@injectable()
export default class TransactionRepository {
    public async create(data: Partial<Transaction>, transaction: TransactionClientContract): Promise<Transaction> {
        return await Transaction.create(data, { client: transaction });
    }
}