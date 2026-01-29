package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Competence;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CompetenceRepositoryTest {

    @Autowired
    private CompetenceRepository competenceRepository;

    @Test
    void saveAndFindCompetence() {
        Competence competence = new Competence();
        competence.setName("Java");

        Competence saved = competenceRepository.save(competence);

        assertThat(saved.getId()).isNotNull();

        Competence found = competenceRepository.findById(saved.getId()).orElseThrow();
        assertThat(found.getName()).isEqualTo("Java");
    }
}

