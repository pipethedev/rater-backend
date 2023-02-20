import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Song from './Song'
import User from './User'

export default class MusicMetric extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public worker_id: string

  @column({ isPrimary: true })
  public song_id: string

  @column()
  public listened: boolean

  @column()
  public listening_duration: string

  @column()
  public listened_at: string

  @column.dateTime({ autoCreate: true })
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
}
