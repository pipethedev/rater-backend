import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Song extends BaseModel {
  public static selfAssignPrimaryKey = true
  
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public user_id: string

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
}
