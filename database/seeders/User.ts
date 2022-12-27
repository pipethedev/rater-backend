import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { Roles } from 'App/Enum'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        first_name: 'Administrator',
        last_name: 'Administrator',
        phone_number: '+447000000000',
        email: 'admin@test.com',
        password: 'password',
        role: Roles.ADMIN,
      },
    ])
  }
}
