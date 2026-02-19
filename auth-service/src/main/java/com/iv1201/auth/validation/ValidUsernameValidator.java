package com.iv1201.auth.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validator implementation for @ValidUsername annotation.
 * Validates username meets minimum length and character requirements.
 * Pattern: [a-zA-Z0-9._-] with minimum 3 characters.
 */
public class ValidUsernameValidator implements ConstraintValidator<ValidUsername, String> {

    /**
     * Username regex: allows letters, digits, dots, hyphens, underscores.
     * Matches client-side usernameCharsRegex.
     */
    private static final Pattern USERNAME_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._-]+$"
    );

    private static final int MIN_LENGTH = 3;

    /** {@inheritDoc} */
    @Override
    public void initialize(ValidUsername constraintAnnotation) {
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
        return USERNAME_PATTERN.matcher(value).matches();
    }
}
