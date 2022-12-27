import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WebhookService from 'App/Services/WebhookService'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import { ErrorResponse } from 'App/Helpers'

export default class WebhookController {
    protected webhookService : WebhookService = container.resolve(WebhookService)

    public async manage({ request, response }: HttpContextContract) {
        try {
            return await this.webhookService.execute(request.body())
        } catch (error) {
            Logger.error(error.message)
            return response.internalServerError(ErrorResponse(error.message))
        }
    }
}
