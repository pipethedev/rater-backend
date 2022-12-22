import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Pricing extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'name' })
  public name: string

  @column({ columnName: 'description' })
  public description: string

  @column({ columnName: 'price' })
  public price: string

  @column({ columnName: 'duration' })
  public duration: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
