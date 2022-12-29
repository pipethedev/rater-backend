import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Song from './Song'
import { v4 as uuidv4 } from 'uuid'
import User from './User'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public user_id: string

  @column({ columnName: 'worker_id' })
  public song_id: string

  @column({ columnName: 'song_id' })
  public worker_id: string

  @column({ columnName: 'rating' })
  public rating: number

  @column({ columnName: 'comment' })
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Song)
  public song: BelongsTo<typeof Song>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeSave()
  public static async generateUUID(rating: Rating) {
    if (!rating.$dirty.id) {
      rating.id = uuidv4()
    }
  }
}
