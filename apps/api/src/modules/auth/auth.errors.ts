import { DomainError } from '../../errors/domain-error';

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

export class InvalidOtpError extends DomainError {
  constructor() {
    super('OTP_INVALID', 400, 'Invalid or expired verification code');
  }
}

export class EmailAlreadyVerifiedError extends DomainError {
  constructor() {
    super('EMAIL_ALREADY_VERIFIED', 400, 'Email is already verified');
  }
}

export class OtpRateLimitError extends DomainError {
  constructor() {
    super('OTP_RATE_LIMIT', 429, 'Please wait before requesting a new code');
  }
}
