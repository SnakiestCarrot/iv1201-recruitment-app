package com.iv1201.auth.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to validate the recruiter secret code.
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidSecretCodeValidator.class)
@Documented
public @interface ValidSecretCode {
    String message() default "Invalid registration code";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
