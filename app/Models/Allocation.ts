import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Song from './Song'
import User from './User'

export default class Allocation extends BaseModel {
  public static table = "allocations"

  @column({ isPrimary: true })
  public id: number

  @column()
  public worker_id: string

  @column({ isPrimary: true })
  public song_id: string

  @column()
  public pending: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => Song, {
    foreignKey: 'song_id',
  })
  public song: BelongsTo<typeof Song>

  @belongsTo(() => User, {
    foreignKey: 'worker_id',
  })
  public worker: BelongsTo<typeof User>
  
}
