package com.iv1201.recruitment.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure email is in valid format.
 * Matches the auth-service ValidEmail and client-side email validation.
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
