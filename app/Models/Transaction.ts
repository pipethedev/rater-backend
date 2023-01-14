import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { CURRENCY, PAYMENT_STATUS } from 'App/Enum'
import { v4 as uuidv4 } from 'uuid'
import User from './User'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public user_id: string

  @column({ columnName: 'song_id' })
  public song_id: string | null

  @column({ columnName: 'pricing_id' })
  public pricing_id: string

  @column({ columnName: 'amount' })
  public amount: number

  @column({ columnName: 'currency' })
  public currency: CURRENCY

  @column({ columnName: 'payment_method' })
  public payment_method: string

  @column({ columnName: 'payment_status' })
  public payment_status: PAYMENT_STATUS

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @beforeSave()
  public static async generateUUID(transaction: Transaction) {
    if (!transaction.$dirty.id) {
      transaction.id = uuidv4()
    }
  }
}
