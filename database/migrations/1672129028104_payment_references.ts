import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payment_references'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable()
      table.uuid('transaction_id').notNullable().unique()
      table.string('reference').notNullable().unique()
      table.boolean('used').defaultTo(false)
      table.foreign('user_id').references('users.id').onUpdate('CASCADE')
      table.foreign('transaction_id').references('transactions.id').onUpdate('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
