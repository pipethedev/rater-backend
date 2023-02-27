import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Song from './Song'
import { v4 as uuidv4 } from 'uuid'
import User from './User'
import { RatingLevel } from 'App/Enum'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public user_id: string

  @column({ columnName: 'song_id'})
  public song_id: string

  @column()
  public worker_id: string

  @column()
  public rating: RatingLevel

  @column()
  public likeComment: string

  @column()
  public disLikeComment: string

  @column()
  public improvementComment: string


  @column.dateTime()
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Song, {
    foreignKey: 'song_id',
  })
  public song: BelongsTo<typeof Song>

  @belongsTo(() => User, {
    foreignKey: 'worker_id',
  })
  public worker: BelongsTo<typeof User>

  @beforeSave()
  public static async generateUUID(rating: Rating) {
    if (!rating.$dirty.id) {
      rating.id = uuidv4()
    }
  }
}
