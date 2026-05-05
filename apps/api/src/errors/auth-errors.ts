import { DomainError } from './domain-error';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('CREDENTIALS_INVALID', 401, 'Invalid email or password');
  }
}

export class AccountDisabledError extends DomainError {
  constructor() {
    super('ACCOUNT_DISABLED', 403, 'Account is disabled');
  }
}

export class TokenInvalidError extends DomainError {
  constructor() {
    super('TOKEN_INVALID', 401, 'Invalid or expired token');
  }
}

export class EmailTakenError extends DomainError {
  constructor() {
    super('CREDENTIALS_INVALID', 401, 'Invalid email or password');
  }
}
