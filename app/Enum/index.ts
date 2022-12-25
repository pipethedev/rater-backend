enum ROLE {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
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
export { ROLE, CURRENCY, PAYMENT_STATUS, PasswordAction }
