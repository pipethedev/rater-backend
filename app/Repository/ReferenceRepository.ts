import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import PaymentReference from "App/Models/PaymentReference";

export default class ReferenceRepository {
    public async create(data: Partial<PaymentReference>, trx?: TransactionClientContract) {
        return await PaymentReference.create(data, { client: trx })
    }

    public async update(id: string, data: Partial<PaymentReference>, trx?: TransactionClientContract) {
        return await PaymentReference.query({ client: trx }).where('id', id).update(data);
    }

    public async findByReference(reference: string): Promise<PaymentReference | null> {
        return await PaymentReference.findBy('reference', reference)
    }
}