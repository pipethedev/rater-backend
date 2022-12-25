const RegisterValidation = {
  first_name: 'required|string',
  last_name: 'required|string',
  phone_number: 'required',
  email: 'required|email',
  password: 'required',
}
const UpdateUserValidation = {
  first_name: 'required',
  last_name: 'required',
  phone_number: 'required',
  email: 'required|email',
}

const LoginValidation = {
  email: 'required|email',
  password: 'required',
}

const UpdatePasswordValidation = {
  old_password: 'required',
  password: 'required|confirmed'
}

const ResetPasswordValidation = {
  password: 'required|confirmed'
}

const EmailValidation = {
  email: 'required|email',
}

export {
  RegisterValidation,
  LoginValidation,
  UpdateUserValidation,
  UpdatePasswordValidation,
  ResetPasswordValidation,
  EmailValidation,
}
