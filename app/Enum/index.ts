enum Roles {
  ADMIN = '1',
  MANAGER = '2',
  USER = '3'
}
enum CURRENCY {
  NGN = 'NGN',
  USD = 'USD',
}
enum PAYMENT_STATUS {
  SUCCESSFUL = 'SUCCESSFUL',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

enum PasswordAction {
  PasswordVerification  = "verification",
  PasswordReset = "reset"
}
export { Roles, CURRENCY, PAYMENT_STATUS, PasswordAction }
