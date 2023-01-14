import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import Transaction from "App/Models/Transaction";
import { injectable } from "tsyringe";

@injectable()
export default class TransactionRepository {
    public async create(data: Partial<Transaction>, transaction: TransactionClientContract): Promise<Transaction> {
        return await Transaction.create(data, { client: transaction });
    }

    public async findOneById(id: string): Promise<Transaction | null> {
        return await Transaction.query().where('id', id).preload('user').first();
    }

    public async findAll(): Promise<Transaction[]> {
        return await Transaction.query().preload('user').orderBy('created_at', 'desc');
    }

    public async findAllByUser(userId: string): Promise<Transaction[]> {
        return await Transaction.query().where('user_id', userId).preload('user').orderBy('created_at', 'desc');
    }
}