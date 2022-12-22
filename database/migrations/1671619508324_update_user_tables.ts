import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('account_verify_token').nullable()
      table.timestamp('account_verify_expires').nullable()
      table.timestamp('email_verified_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
