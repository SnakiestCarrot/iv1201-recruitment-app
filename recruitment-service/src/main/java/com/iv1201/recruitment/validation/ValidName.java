package com.iv1201.recruitment.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure a name contains only
 * Unicode letters, spaces, and hyphens.
 * Matches client-side nameCharsRegex from frontend validation.ts.
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidNameValidator.class)
@Documented
public @interface ValidName {
    String message() default "Name must contain only letters, spaces, and hyphens";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
