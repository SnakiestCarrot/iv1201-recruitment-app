import { z } from 'zod';

/**
 * Regex for Swedish Personnummer in YYYYMMDD-XXXX format.
 */
const pnrRegex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-\d{4}$/;

/**
 * Allowed characters for usernames: letters, digits, dots, hyphens, underscores.
 */
const usernameCharsRegex = /^[a-zA-Z0-9._-]+$/;

/**
 * Allowed characters for passwords: letters, digits, and common symbols.
 */
const passwordCharsRegex = /^[a-zA-Z0-9!@#$%^&*()\-_=+.,;:?]+$/;

/**
 * Allowed characters for names: Unicode letters, spaces, and hyphens.
 */
const nameCharsRegex = /^[\p{L} -]+$/u;

/**
 * Shared validation rules used across multiple schemas.
 */
export const commonRules = {
  email: z
    .string()
    .min(1, 'validation.email-required')
    .email('validation.email-invalid'),

  pnr: z
    .string()
    .min(1, 'validation.pnr-required')
    .regex(pnrRegex, 'validation.pnr-format'),
};

/**
 * Schema for the job application personal details section.
 */
export const ApplicationSchema = z.object({
  name: z
    .string()
    .min(1, 'validation.name-required')
    .regex(nameCharsRegex, 'validation.name-invalid-characters'),
  surname: z
    .string()
    .min(1, 'validation.surname-required')
    .regex(nameCharsRegex, 'validation.surname-invalid-characters'),
  email: commonRules.email,
  pnr: commonRules.pnr,
});

/**
 * Schema for user authentication.
 */
export const LoginSchema = z.object({
  username: z.string().min(1, 'auth.username-required'),
  password: z.string().min(1, 'auth.password-required'),
});

/**
 * Schema for basic applicant registration.
 */
export const RegisterUserSchema = z.object({
  username: z
    .string()
    .min(3, 'auth.insufficient-username-length')
    .regex(usernameCharsRegex, 'auth.username-invalid-characters'),
  password: z
    .string()
    .min(6, 'auth.insufficient-password-length')
    .regex(passwordCharsRegex, 'auth.password-invalid-characters'),
  email: commonRules.email,
  pnr: commonRules.pnr,
});

/**
 * Schema for recruiter registration, extending the basic user schema.
 */
export const RecruiterRegisterSchema = RegisterUserSchema.extend({
  secretCode: z.string().trim().min(1, 'auth.secret-code-required'),
});
