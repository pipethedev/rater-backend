import Database from "@ioc:Adonis/Lucid/Database";
import { PAYMENT_STATUS, PaystackEventAction } from "App/Enum";
import Pricing from "App/Models/Pricing";
import User from "App/Models/User";
import PricingRepository from "App/Repository/PricingRepository";
import ReferenceRepository from "App/Repository/ReferenceRepository";
import TransactionRepository from "App/Repository/TransactionRepository";
import UserRepository from "App/Repository/UserRepository";
import { ObjectLiteral } from "App/Types";
import { container } from "tsyringe";

export default class WebhookService {
    protected provider: string[] = ["paystack"];
    protected userRepository = container.resolve(UserRepository)
    protected pricingRepository = container.resolve(PricingRepository)
    protected paymentReferenceRepository = container.resolve(ReferenceRepository)
    protected transactionRepository: TransactionRepository = container.resolve(TransactionRepository)

    public async execute({ event, data }: ObjectLiteral) {
        const trx = await Database.transaction()
        console.log(data)
        try {

            const user = await this.userRepository.findByEmail(data.customer.email) as User

            const pricing = await this.pricingRepository.current() as Pricing

            if(event == PaystackEventAction.SUCCESSFUL) {
                if(data.amount === pricing.price) {
                    const payment = await this.transactionRepository.create({
                        user_id: user.id,
                        pricing_id: pricing.id,
                        amount: data.amount,
                        payment_method: this.provider[0],
                        payment_status: PAYMENT_STATUS.SUCCESSFUL
                    }, trx)
                    // save reference to database
                    await this.paymentReferenceRepository.create({ user_id: user.id, transaction_id: payment.id, reference: data.reference }, trx);               
                }
            }
            await trx.commit()
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }
}