import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Song from './Song';

export default class AdminFeedback extends BaseModel {
  public static table = "admin_feedbacks"

  @column({ isPrimary: true })
  public id: number

  @column()
  public admin_id: string;

  @column()
  public song_id: string;

  @column()
  public comment: string;

  @belongsTo(() => User, {
    foreignKey: 'admin_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Song, {
    foreignKey: 'song_id',
  })
  public song: BelongsTo<typeof Song>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
