package com.iv1201.recruitment.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Class-level validation annotation to ensure that fromDate is
 * strictly before toDate in an availability period.
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidDateRangeValidator.class)
@Documented
public @interface ValidDateRange {
    String message() default "From date must be before to date";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
