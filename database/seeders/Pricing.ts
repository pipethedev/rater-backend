import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Pricing from 'App/Models/Pricing'

export default class extends BaseSeeder {
  public async run () {
    await Pricing.create({
      name: 'Soundseek basic payment',
      description: 'Soundseek pricing to enable music uploads',
      price: 2500000,
      duration: 'NON-EXPIRY'
    })
  }
}
