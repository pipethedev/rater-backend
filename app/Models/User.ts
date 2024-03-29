import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { Roles } from 'App/Enum'
import { v4 as uuidv4 } from 'uuid'
import Rating from './Rating'
import Song from './Song'
import Transaction from './Transaction'
import Allocation from './Allocation'

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

  @column({
    serialize: (value: string) => {
      const index = Object.values(Roles).indexOf(value as Roles);
      return Object.keys(Roles)[index];
    },
  })
  public role: Roles

  @column({ serializeAs: null })
  public password: string

  @column({ serialize: (value: number) => {
    return value == 1;
  }})
  public banned: boolean

  @column()
  public banned_at: Date | null

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

  @hasMany(() => Rating, {
    foreignKey: 'worker_id',
  })
  public ratings: HasMany<typeof Rating>

  @hasMany(() => Song, {
    foreignKey: 'user_id',
  })
  public songs: HasMany<typeof Song>

  @hasMany(() => Transaction, {
    foreignKey: 'user_id',
  })
  public transactions: HasMany<typeof Transaction>

  @hasMany(() => Allocation, {
    foreignKey: 'worker_id',
  })
  public allocations: HasMany<typeof Allocation>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  @beforeSave()
  public static async generateUUID(user: User) {
    if (!user.$dirty.id) {
      user.id = uuidv4()
    }
  }
}
