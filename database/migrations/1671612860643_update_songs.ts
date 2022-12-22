import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'songs'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('rating_id').references('ratings.id').onUpdate('CASCADE')
      table.uuid('rating_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
