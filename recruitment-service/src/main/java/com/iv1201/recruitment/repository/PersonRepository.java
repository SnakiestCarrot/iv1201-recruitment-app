package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.Person;

/**
 * Repository for accessing Person entities from the database.
 */
public interface PersonRepository extends JpaRepository<Person, Long> {
    
    boolean existsByEmail(String email);
}