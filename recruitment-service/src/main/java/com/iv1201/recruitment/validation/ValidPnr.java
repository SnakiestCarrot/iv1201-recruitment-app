package com.iv1201.recruitment.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure a Swedish personnummer
 * is in YYYYMMDD-XXXX format. Matches the auth-service ValidPnr
 * and client-side pnrRegex.
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidPnrValidator.class)
@Documented
public @interface ValidPnr {
    String message() default "Personal number must be in YYYYMMDD-XXXX format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
