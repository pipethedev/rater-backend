import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class VerificationToken extends BaseModel {
  public static table = 'tokens'
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public token: string

  @column()
  public email: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeSave()
  public static async generateUUID(verificationToken: VerificationToken) {
    if (!verificationToken.$dirty.id) {
      verificationToken.id = uuidv4()
    }
  }
}
