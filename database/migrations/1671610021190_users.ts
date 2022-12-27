import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Roles } from 'App/Enum'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone_number').notNullable().unique()
      table.string('email').notNullable().unique()
      table.enum('role', [Roles.ADMIN, Roles.MANAGER, Roles.USER]).notNullable().defaultTo(Roles.USER)
      table.string('password').notNullable()
      table.boolean('banned').defaultTo(false)
      table.dateTime('banned_at').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
