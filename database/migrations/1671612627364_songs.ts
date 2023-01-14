import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'songs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.uuid('user_id').notNullable()
      table.string('title').notNullable()
      table.text('file_url').notNullable()
      table.string('file_name').notNullable()
      table.string('file_type').notNullable()
      table.string('external_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.foreign('user_id').references('users.id').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
