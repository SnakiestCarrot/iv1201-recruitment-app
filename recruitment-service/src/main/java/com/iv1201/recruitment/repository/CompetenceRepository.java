package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.Competence;

/**
 * Repository for accessing Competence entities from the database.
 */
public interface CompetenceRepository extends JpaRepository<Competence, Long> {
}

