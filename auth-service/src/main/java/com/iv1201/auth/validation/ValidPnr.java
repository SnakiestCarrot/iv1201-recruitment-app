package com.iv1201.auth.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure personal number (pnr) is in valid Swedish format.
 * Matches client-side pnr validation from frontend-service/src/utils/validation.ts
 * Format: YYYYMMDD-XXXX where YYYY is 19xx or 20xx, MM is 01-12, DD is 01-31, XXXX is any 4 digits
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidPnrValidator.class)
@Documented
public @interface ValidPnr {
    String message() default "Personal number must be in format YYYYMMDD-XXXX (Swedish Personnummer)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
