import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import PaymentReference from "App/Models/PaymentReference";

export default class ReferenceRepository {
    public async create(data: Partial<PaymentReference>, trx?: TransactionClientContract) {
        return await PaymentReference.create(data, { client: trx })
    }

    public async update(id: string, data: Partial<PaymentReference>, trx?: TransactionClientContract) {
        return await PaymentReference.query({ client: trx }).where('id', id).update(data);
    }

    public async findByUser(userId: string): Promise<PaymentReference[]> {
        return await PaymentReference.query().where({ user_id: userId }).orderBy('created_at', 'desc');
    }

    public async findByReference(reference: string): Promise<PaymentReference | null> {
        return await PaymentReference.findBy('reference', reference)
    }

    public async findUnused(userId: string): Promise<PaymentReference | null> {
        return await PaymentReference.query().where({
            'user_id': userId,
            'used': false
        }).first();
    }
}