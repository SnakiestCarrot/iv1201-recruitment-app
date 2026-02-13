package com.iv1201.auth.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure email is in valid format.
 * Matches client-side email validation from frontend-service/src/utils/validation.ts
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidEmailValidator.class)
@Documented
public @interface ValidEmail {
    String message() default "Email must be a valid email address";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
