package com.iv1201.auth.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure password meets requirements.
 * Matches client-side password validation from frontend-service/src/utils/validation.ts
 * Requirements:
 * - Minimum 6 characters
 * - Only letters, digits, and common symbols: [a-zA-Z0-9!@#$%^&*()\-_=+.,;:?]
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidPasswordValidator.class)
@Documented
public @interface ValidPassword {
    String message() default "Password must be at least 6 characters and contain only letters, digits, and symbols (!@#$%^&*()-_=+.,;:?)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
