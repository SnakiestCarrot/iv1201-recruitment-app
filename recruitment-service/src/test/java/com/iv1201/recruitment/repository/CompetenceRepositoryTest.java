package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Competence;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class CompetenceRepositoryTest {

    @Autowired
    private CompetenceRepository competenceRepository;

    @Test
    public void testSaveAndFindCompetence() {
        Competence competence = new Competence();
        competence.setName("Java Programming");

        Competence saved = competenceRepository.save(competence);

        assertThat(saved.getCompetenceId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Java Programming");

        Competence found = competenceRepository.findById(saved.getCompetenceId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Java Programming");
    }
}