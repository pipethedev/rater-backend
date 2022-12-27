import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class Pricing extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'name' })
  public name: string

  @column({ columnName: 'description' })
  public description: string

  @column({ columnName: 'price' })
  public price: number

  @column({ columnName: 'duration' })
  public duration: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeSave()
  public static async generateUUID(pricing: Pricing) {
    if (!pricing.$dirty.id) {
      pricing.id = uuidv4()
    }
  }
}
