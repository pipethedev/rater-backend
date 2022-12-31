import Env from '@ioc:Adonis/Core/Env'
import AppError from 'App/Helpers/error';
import { HTTPClient } from 'App/Helpers/http'
import PaymentReference from 'App/Models/PaymentReference';
import ReferenceRepository from 'App/Repository/ReferenceRepository';
import { BAD_REQUEST, OK } from 'http-status';
import { container, injectable } from 'tsyringe';

@injectable()
export default class PaystackService {
    protected paymentReferenceRepository: ReferenceRepository = container.resolve(ReferenceRepository)
    private client = HTTPClient.create({ baseURL: Env.get('PAYSTACK_BASE_URL'), headers: {
        Authorization: `Bearer ${Env.get('PAYSTACK_SECRET_KEY')}`
    } })

    public async verify(reference: string) {
        try {
            const response = await this.client.get(`/transaction/verify/${reference}`)

            console.log()

            if (response.status !== OK || response.data.data.status == 'failed') throw new AppError(BAD_REQUEST, "Invalid payment reference provided")

            const payment = await this.paymentReferenceRepository.findByReference(reference) as PaymentReference

            if(payment.used) throw new AppError(BAD_REQUEST, "You can't use a payment reference multiple times")

            return payment;
        } catch (error) {
            if (error instanceof AppError) throw new AppError(BAD_REQUEST, error.message)
            throw new Error(error.response.data.message)
        }
    }
}