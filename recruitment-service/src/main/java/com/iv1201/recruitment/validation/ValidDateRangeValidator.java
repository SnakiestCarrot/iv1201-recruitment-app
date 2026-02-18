package com.iv1201.recruitment.validation;

import com.iv1201.recruitment.dto.AvailabilityDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator implementation for @ValidDateRange annotation.
 * Validates that fromDate is strictly before toDate on an AvailabilityDTO.
 */
public class ValidDateRangeValidator implements ConstraintValidator<ValidDateRange, AvailabilityDTO> {

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
    }

    @Override
    public boolean isValid(AvailabilityDTO value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        // If either date is null, let @NotNull handle it
        if (value.getFromDate() == null || value.getToDate() == null) {
            return true;
        }
        return value.getFromDate().isBefore(value.getToDate());
    }
}
