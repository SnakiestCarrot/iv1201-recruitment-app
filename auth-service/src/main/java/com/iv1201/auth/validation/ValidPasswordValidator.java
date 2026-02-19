package com.iv1201.auth.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validator implementation for @ValidPassword annotation.
 * Validates password meets minimum length and character requirements.
 * Pattern: [a-zA-Z0-9!@#$%^&*()\-_=+.,;:?] with minimum 6 characters.
 */
public class ValidPasswordValidator implements ConstraintValidator<ValidPassword, String> {

    /**
     * Password regex: allows letters, digits, and common symbols.
     * Matches client-side passwordCharsRegex.
     */
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9!@#$%^&*()?\\-_=+.,;:]+$"
    );

    private static final int MIN_LENGTH = 6;

    /** {@inheritDoc} */
    @Override
    public void initialize(ValidPassword constraintAnnotation) {
    }

    /** {@inheritDoc} */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Let @NotBlank handle null/blank validation
        }

        // Check minimum length
        if (value.length() < MIN_LENGTH) {
            return false;
        }

        // Check allowed characters
        return PASSWORD_PATTERN.matcher(value).matches();
    }
}
