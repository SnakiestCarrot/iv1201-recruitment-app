package com.iv1201.recruitment.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validator implementation for @ValidPnr annotation.
 * Validates Swedish personnummer format YYYYMMDD-XXXX.
 */
public class ValidPnrValidator implements ConstraintValidator<ValidPnr, String> {

    /**
     * Swedish personnummer regex matching auth-service and frontend patterns.
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
