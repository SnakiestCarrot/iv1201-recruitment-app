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
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  pnr: z
    .string()
    .min(1, 'Person number is required')
    .regex(pnrRegex, 'Must be in format YYYYMMDD-XXXX'),
};

/**
 * Schema for the job application personal details section.
 */
export const ApplicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: commonRules.email,
  pnr: commonRules.pnr,
});

/**
 * Schema for user authentication.
 */
export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for basic applicant registration.
 */
export const RegisterUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Schema for recruiter registration, extending the basic user schema.
 */
export const RecruiterRegisterSchema = RegisterUserSchema.extend({
  secretCode: z.string().min(1, 'Secret code is required'),
});
