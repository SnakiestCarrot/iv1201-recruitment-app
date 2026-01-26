package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.Availability;

/**
 * Repository for accessing Availability entities from the database.
 */
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
}

