import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admin_feedbacks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('admin_id').notNullable()
      table.uuid('song_id').notNullable()
      table.text("comment").notNullable();
      table.foreign('admin_id').references('users.id').onUpdate('CASCADE')
      table.foreign('song_id').references('songs.id').onUpdate('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
