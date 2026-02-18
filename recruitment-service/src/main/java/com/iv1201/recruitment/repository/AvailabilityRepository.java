package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.Availability;

import java.util.List;

/**
 * Repository for accessing Availability entities from the database.
 */
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    /**
     * Find all availability periods for a given person ID.
     *
     * @param id the person ID
     * @return list of availability periods for the person
     */
    List<Availability> findByPerson_Id(Long id);

    /**
     * Delete all availability periods for a given person ID.
     *
     * @param id the person ID
     */
    void deleteByPerson_Id(Long id);
}

