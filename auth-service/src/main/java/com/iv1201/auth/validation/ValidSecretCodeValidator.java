package com.iv1201.auth.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Validator implementation for @ValidSecretCode annotation.
 * Checks if the provided secret code matches the configured recruiter secret.
 */
@Component
public class ValidSecretCodeValidator implements ConstraintValidator<ValidSecretCode, String> {

    @Value("${recruiter.secret.code}")
    private String recruiterSecretCode;

    @Override
    public void initialize(ValidSecretCode constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false; // Secret code cannot be null
        }
        return value.equals(recruiterSecretCode);
    }
}
