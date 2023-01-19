import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PricingService from 'App/Services/PricingService'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import { ErrorResponse } from 'App/Helpers'
import { UpdatePricing } from 'App/Types'
import AppError from 'App/Helpers/error'

export default class PricingsController {

    protected pricingService: PricingService = container.resolve(PricingService)

    public async fetch({ response }: HttpContextContract) {
        try {
            const result = await this.pricingService.fetchPricing()
            return response.ok(result)
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('We could not fetch the latest pricing, try again later!'))
        }
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const body = request.body() as UpdatePricing;
            const price = { price: body.price * 100}
            const result = await this.pricingService.updatePricing(request.param('priceId'), price)
            return response.ok(result)
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('We could not fetch the latest pricing, try again later!'))
        }
    }
}
