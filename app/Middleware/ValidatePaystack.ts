import crypto from "crypto";
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse } from "App/Helpers";

export default class ValidatePaystack {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      const secret = Env.get('PAYSTACK_SECRET_KEY')
      const hash = crypto.createHmac("sha512", secret).update(JSON.stringify(request.body())).digest("hex");
        
      if (!(hash === request.header('x-paystack-signature'))) {
        Logger.error("Invalid paystack signature")
        return response.ok({})
      }
    } catch (error: any) {
      return response.badRequest(ErrorResponse(error.message))
    }
    await next()
  }
}
