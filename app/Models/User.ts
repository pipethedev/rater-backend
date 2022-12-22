import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { ROLE } from 'App/Enum'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true
  
  @column({ isPrimary: true })
  public id: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public phone_number: string

  @column()
  public email: string

  @column()
  public role: ROLE

  @column({ serializeAs: null })
  public password: string

  @column()
  public banned: boolean

  @column()
  public banned_at: DateTime

  @column()
  public email_verified_at: Date

  @column()
  public account_verify_token: string | null

  @column()
  public account_verify_expires: Date | null

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
