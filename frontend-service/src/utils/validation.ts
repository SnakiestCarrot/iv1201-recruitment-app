import { z } from 'zod';

/**
 * Regex for Swedish Personnummer in YYYYMMDD-XXXX format.
 */
const pnrRegex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-\d{4}$/;

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
  name: z.string().min(1, 'validation.name-required'),
  surname: z.string().min(1, 'validation.surname-required'),
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
  username: z.string().min(3, 'auth.insufficient-username-length'),
  password: z.string().min(6, 'auth.insufficient-password-length'),
});

/**
 * Schema for recruiter registration, extending the basic user schema.
 */
export const RecruiterRegisterSchema = RegisterUserSchema.extend({
  secretCode: z.string().trim().min(1, 'auth.secret-code-required'),
});
