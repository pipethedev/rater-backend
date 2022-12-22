import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException';
import User from 'App/Models/User';

export default class EmailVerified {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user! as User;
    const rule = !user.email_verified_at && user.account_verify_token !== null;
    if (rule) {
      throw new UnAuthorizedException('Email not verified')
    }
    await next()
  }
}
