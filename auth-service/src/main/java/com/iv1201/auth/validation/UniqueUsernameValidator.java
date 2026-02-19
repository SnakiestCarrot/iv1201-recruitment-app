package com.iv1201.auth.validation;

import com.iv1201.auth.integration.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

/**
 * Validator implementation for @UniqueUsername annotation.
 * Checks if a username already exists in the database.
 */
@Component
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    private final UserRepository userRepository;

    /**
     * @param userRepository the repository for checking username existence.
     */
    public UniqueUsernameValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** {@inheritDoc} */
    @Override
    public void initialize(UniqueUsername constraintAnnotation) {
    }

    /** {@inheritDoc} */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Let @NotNull handle null validation
        }
        return !userRepository.existsByUsername(value);
    }
}
