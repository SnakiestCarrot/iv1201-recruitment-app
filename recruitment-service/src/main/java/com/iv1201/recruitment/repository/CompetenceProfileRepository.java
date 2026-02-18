package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.CompetenceProfile;

import java.util.List;

/**
 * Repository for accessing CompetenceProfile entities from the database.
 */
public interface CompetenceProfileRepository extends JpaRepository<CompetenceProfile, Long> {

    /**
     * Find all competence profiles for a given person ID.
     *
     * @param id the person ID
     * @return list of competence profiles for the person
     */
    List<CompetenceProfile> findByPerson_Id(Long id);

    /**
     * Delete all competence profiles for a given person ID.
     *
     * @param id the person ID
     */
    void deleteByPerson_Id(Long id);
}

