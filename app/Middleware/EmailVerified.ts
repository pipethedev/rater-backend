import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse } from 'App/Helpers';
import User from 'App/Models/User';

export default class EmailVerified {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user! as User;
    const rule = !user.email_verified_at && user.account_verify_token !== null;
    if (rule) {
      return response.unauthorized(ErrorResponse('Please verify your email address'))
    }
    await next()
  }
}
