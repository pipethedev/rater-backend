import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { injectable } from 'tsyringe'

@injectable()
export default class MailService {
  public async send<T>(to: string, subject: string, view: string, data: T) {
    return await Mail.sendLater((message) => {
      message.from(Env.get('MAIL_FROM')).to(to).subject(subject).htmlView(view, data)
    })
  }
}
