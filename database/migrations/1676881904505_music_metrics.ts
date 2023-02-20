import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'music_metrics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('song_id').notNullable()
      table.string('worker_id').notNullable()
      table.boolean('listened').defaultTo(false);
      table.string('listening_duration').nullable();
      table.string('listened_at').nullable();
      table.foreign('worker_id').references('users.id').onUpdate('CASCADE')
      table.foreign('song_id').references('songs.id').onUpdate('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
