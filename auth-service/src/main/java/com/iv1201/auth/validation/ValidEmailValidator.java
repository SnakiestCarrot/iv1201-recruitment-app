package com.iv1201.auth.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validator implementation for @ValidEmail annotation.
 * Validates email format using a standard email regex pattern.
 */
public class ValidEmailValidator implements ConstraintValidator<ValidEmail, String> {

    /**
     * Standard email regex pattern.
     * Matches most common email formats: user@domain.com
     */
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    /** {@inheritDoc} */
    @Override
    public void initialize(ValidEmail constraintAnnotation) {
    }

    /** {@inheritDoc} */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Let @NotBlank handle null/blank validation
        }
        return EMAIL_PATTERN.matcher(value).matches();
    }
}
