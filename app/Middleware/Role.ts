import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Roles } from 'App/Enum'

export default class Role {
  // .middleware(['auth', 'role:admin'])
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, guards: string[]) {

    const roles = guards.map((guard) => Roles[guard.toUpperCase()])

    if(!roles.includes(auth.user?.role)) {
      return response.forbidden({ error: `This is restricted to ${guards.join(', ')} users` })
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
