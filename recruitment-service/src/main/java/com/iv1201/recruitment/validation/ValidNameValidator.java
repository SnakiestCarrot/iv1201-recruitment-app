package com.iv1201.recruitment.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validator implementation for @ValidName annotation.
 * Validates that a name contains only Unicode letters, spaces, and hyphens.
 */
public class ValidNameValidator implements ConstraintValidator<ValidName, String> {

    /**
     * Name regex pattern matching frontend nameCharsRegex: /^[\p{L} -]+$/u
     */
    private static final Pattern NAME_PATTERN = Pattern.compile(
        "^[\\p{L} -]+$"
    );

    @Override
    public void initialize(ValidName constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Let @NotBlank handle null/blank validation
        }
        return NAME_PATTERN.matcher(value).matches();
    }
}
