package com.iv1201.recruitment.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;

/**
 * Validator implementation for @ValidStatus annotation.
 * Validates that status is one of UNHANDLED, ACCEPTED, or REJECTED.
 */
public class ValidStatusValidator implements ConstraintValidator<ValidStatus, String> {

    private static final Set<String> VALID_STATUSES = Set.of("UNHANDLED", "ACCEPTED", "REJECTED");

    @Override
    public void initialize(ValidStatus constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Let @NotBlank handle null/blank validation
        }
        return VALID_STATUSES.contains(value.toUpperCase());
    }
}
