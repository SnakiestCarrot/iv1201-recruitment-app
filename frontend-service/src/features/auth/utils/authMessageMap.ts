/**
 * Maps domain-level auth codes (from {@link AuthError} and {@link AuthStatus})
 * to i18n translation keys used by the view layer.
 */
export const authMessageMap: Record<string, string> = {
  INVALID_CREDENTIALS: 'auth.invalid-credentials',
  USERNAME_TAKEN: 'auth.username-taken',
  REGISTRATION_FAILED: 'auth.registration-failed',
  INVALID_SECRET_CODE: 'auth.invalid-secret-code',
  SERVER_ERROR: 'auth.server-error',
  LOGIN_FAILED: 'auth.login-failed',
  LOGGING_IN: 'auth.logging-in',
  LOGIN_SUCCESS: 'auth.login-success',
  REGISTRATION_SUCCESS: 'auth.register-success',
  REGISTERING: 'auth.registering',
  OLD_USER_SENDING: 'auth.old-user-sending',
  OLD_USER_RESET_MESSAGE: 'auth.old-user-reset-message',
  PASSWORD_MISMATCH: 'auth.password-mismatch',
};
