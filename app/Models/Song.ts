import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, HasMany, BelongsTo, belongsTo, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Rating from './Rating'
import User from './User'
import AdminFeedback from './AdminFeedback'

export default class Song extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public user_id: string

  @column({ columnName: 'title' })
  public title: string

  @column({ columnName: 'file_url' })
  public file_url: string

  @column({ columnName: 'file_name' })
  public file_name: string

  @column({ columnName: 'file_type' })
  public file_type: string

  @column({ columnName: 'external_id' })
  public external_id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @hasMany(() => Rating, {
    foreignKey: 'song_id',
  })
  public ratings: HasMany<typeof Rating>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @hasOne(() => AdminFeedback, {
    foreignKey: 'song_id',
  })
  public admin_feedback: HasOne<typeof AdminFeedback>

  @beforeSave()
  public static async generateUUID(song: Song) {
    if (!song.$dirty.id) {
      song.id = uuidv4()
    }
  }
}
