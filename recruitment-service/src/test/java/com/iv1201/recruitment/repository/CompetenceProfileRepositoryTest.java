package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Competence;
import com.iv1201.recruitment.model.CompetenceProfile;
import com.iv1201.recruitment.model.Person;

import com.iv1201.recruitment.repository.CompetenceProfileRepository;
import com.iv1201.recruitment.repository.PersonRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CompetenceProfileRepositoryTest {

    @Autowired
    private CompetenceProfileRepository competenceProfileRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private CompetenceRepository competenceRepository;

    @Test
    void saveAndFindCompetenceProfile() {
        Person person = new Person();
        person.setName("Gustav");
        person.setSurname("Grahn");
        person.setEmail("gustav@test.com");
        person.setPnr("199001011234");
        person.setUsername("ggrahn");
        person = personRepository.save(person);

        Competence competence = new Competence();
        competence.setName("Java");
        competence = competenceRepository.save(competence);

        CompetenceProfile profile = new CompetenceProfile();
        profile.setPerson(person);
        profile.setCompetence(competence);
        profile.setYearsOfExperience(new BigDecimal("5.0"));

        CompetenceProfile saved = competenceProfileRepository.save(profile);

        assertThat(saved.getId()).isNotNull();

        CompetenceProfile found =
                competenceProfileRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getPerson().getId()).isEqualTo(person.getId());
        assertThat(found.getCompetence().getId()).isEqualTo(competence.getId());
        assertThat(found.getYearsOfExperience())
                .isEqualByComparingTo("5.0");
    }
}


