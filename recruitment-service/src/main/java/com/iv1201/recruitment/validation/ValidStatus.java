package com.iv1201.recruitment.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure application status is
 * one of the allowed values: UNHANDLED, ACCEPTED, or REJECTED.
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidStatusValidator.class)
@Documented
public @interface ValidStatus {
    String message() default "Status must be UNHANDLED, ACCEPTED, or REJECTED";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
