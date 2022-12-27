import Pricing from "App/Models/Pricing";
import { injectable } from "tsyringe";
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

@injectable()
export default class PricingRepository {
    public async current(): Promise<Pricing | null> {
        return await Pricing.first()
    }

    public async updateOne(id: string, data: Partial<Pricing>, trx?: TransactionClientContract): Promise<Pricing[]> {
        return await Pricing.query({ client: trx }).where('id', id).update(data);
    }
}