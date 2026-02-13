package com.iv1201.auth.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validator implementation for @ValidPnr annotation.
 * Validates Swedish personal number (personnummer) format: YYYYMMDD-XXXX
 * - YYYY: Year (19xx or 20xx)
 * - MM: Month (01-12)
 * - DD: Day (01-31)
 * - XXXX: 4 digit identifier
 */
public class ValidPnrValidator implements ConstraintValidator<ValidPnr, String> {

    /**
     * Swedish Personnummer regex pattern: YYYYMMDD-XXXX
     * Matches the same pattern as client-side validation.
     */
    private static final Pattern PNR_PATTERN = Pattern.compile(
        "^(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])-\\d{4}$"
    );

    @Override
    public void initialize(ValidPnr constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Let @NotBlank handle null/blank validation
        }
        return PNR_PATTERN.matcher(value).matches();
    }
}
