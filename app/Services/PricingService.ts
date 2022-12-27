import Database from "@ioc:Adonis/Lucid/Database";
import { SuccessResponse } from "App/Helpers";
import PricingRepository from "App/Repository/PricingRepository";
import { UpdatePricing } from "App/Types";
import { container, injectable } from "tsyringe";

@injectable()
export default class PricingService {
    protected pricingRepository: PricingRepository = container.resolve(PricingRepository)

    public async fetchPricing() {
        try {
            const price = await this.pricingRepository.current()
            return SuccessResponse("Latest price fetched successfully", price)
        } catch (error) {
            throw error;
        }
    }

    public async updatePricing(id: string, body: UpdatePricing) {
        const trx = await Database.transaction()
        try {
            await this.pricingRepository.updateOne(id, body, trx)
            await trx.commit()
            return SuccessResponse("Price updated successfully", null)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }
}