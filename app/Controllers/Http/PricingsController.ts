import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PricingService from 'App/Services/PricingService'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import { AppError } from 'App/Exceptions/Handler'
import { ErrorResponse } from 'App/Helpers'

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

    public async update({ }: HttpContextContract) {}
}
