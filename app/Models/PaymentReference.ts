import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class PaymentReference extends BaseModel {
  public static table = "payment_references"
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public transaction_id: string

  @column()
  public reference: string

  @column()
  public used: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeSave()
  public static async generateUUID(reference: PaymentReference) {
    if (!reference.$dirty.id) {
      reference.id = uuidv4()
    }
  }
}
