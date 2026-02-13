package com.iv1201.auth.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure username meets requirements.
 * Matches client-side username validation from frontend-service/src/utils/validation.ts
 * Requirements:
 * - Minimum 3 characters
 * - Only letters, digits, dots, hyphens, underscores: [a-zA-Z0-9._-]
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidUsernameValidator.class)
@Documented
public @interface ValidUsername {
    String message() default "Username must be at least 3 characters and contain only letters, digits, dots, hyphens, or underscores";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
