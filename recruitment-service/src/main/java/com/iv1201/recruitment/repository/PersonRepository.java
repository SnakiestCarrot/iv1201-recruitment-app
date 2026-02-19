package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.Person;

/**
 * Repository for accessing Person entities from the database.
 */
public interface PersonRepository extends JpaRepository<Person, Long> {
    
    /**
     * Checks whether a person with the given email already exists.
     *
     * @param email the email address to check.
     * @return {@code true} if a person with the email exists, {@code false} otherwise.
     */
    boolean existsByEmail(String email);
}