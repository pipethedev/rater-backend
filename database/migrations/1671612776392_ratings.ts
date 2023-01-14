import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { RatingLevel } from 'App/Enum'

export default class extends BaseSchema {
  protected tableName = 'ratings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable()
      table.uuid('worker_id').notNullable()
      table.uuid('song_id').notNullable()
      table.enum('rating', [RatingLevel.Bad, RatingLevel.Fair, RatingLevel.Good, RatingLevel.AlmostGood]).notNullable()
      table.text('comment').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.foreign('user_id').references('users.id').onUpdate('CASCADE')
      table.foreign('worker_id').references('users.id').onUpdate('CASCADE')
      table.foreign('song_id').references('songs.id').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
