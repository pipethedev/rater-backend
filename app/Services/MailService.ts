import Mail from '@ioc:Adonis/Addons/Mail'
import { ObjectLiteral } from 'App/Types'
import Env from '@ioc:Adonis/Core/Env'
import { injectable } from 'tsyringe'

@injectable()
export default class MailService {
  public async send(to: string, view: string, data: ObjectLiteral) {
    return await Mail.sendLater((message) => {
      message.from(Env.get('MAIL_FROM')).to(to).subject('Welcome Onboard!').htmlView(view, data)
    })
  }
}
