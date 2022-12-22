import { ROLE } from 'App/Enum'
import { DateTime } from 'luxon'

type ObjectLiteral = {
  [key: string]: any
}

type User = {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  role: ROLE
  password: string
  banned: boolean
  banned_at: string
  created_at: DateTime
  updated_at: DateTime
}

type Login = Pick<User, 'email' | 'password'>
type Register = Omit<User, 'banned' | 'banned_at' | 'created_at' | 'updated_at'>
type UpdateUser = Omit<
  User,
  'email' | 'password' | 'banned' | 'banned_at' | 'created_at' | 'updated_at'
>

type Token = {
  token: string
  email: string
}

export { Login, Register, ObjectLiteral, Token, UpdateUser }
