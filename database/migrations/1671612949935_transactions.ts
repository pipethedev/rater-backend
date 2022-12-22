import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable()
      table.uuid('song_id').notNullable()
      table.uuid('pricing_id').notNullable()
      table.integer('amount').notNullable()
      table.enum('currency', ['NGN', 'USD']).notNullable()
      table.string('payment_method').notNullable()
      table.enum('payment_status', ['SUCCESSFUL', 'PENDING', 'FAILED']).notNullable()
      table.string('payment_reference').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.foreign('user_id').references('users.id').onUpdate('CASCADE')
      table.foreign('song_id').references('songs.id').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
