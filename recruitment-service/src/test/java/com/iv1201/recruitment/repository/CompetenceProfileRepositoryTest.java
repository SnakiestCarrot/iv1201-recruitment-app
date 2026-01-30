package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Competence;
import com.iv1201.recruitment.model.CompetenceProfile;
import com.iv1201.recruitment.model.Person;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class CompetenceProfileRepositoryTest {

    @Autowired
    private CompetenceProfileRepository competenceProfileRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private CompetenceRepository competenceRepository;

    @Test
    public void testFindByPersonId() {
        // Create Person
        Person person = new Person();
        person.setId(1L);
        person.setName("Test");
        person.setSurname("User");
        person.setEmail("test@example.com");
        person.setPnr("19900101-1234");
        Person savedPerson = personRepository.save(person);

        Competence competence = new Competence();
        competence.setName("Test Skill");
        Competence savedCompetence = competenceRepository.save(competence);

        CompetenceProfile profile = new CompetenceProfile();
        profile.setPerson(savedPerson);
        profile.setCompetence(savedCompetence);
        profile.setYearsOfExperience(new BigDecimal("2.5"));
        competenceProfileRepository.save(profile);

        List<CompetenceProfile> results = competenceProfileRepository.findByPerson_Id(savedPerson.getId());
        
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getYearsOfExperience()).isEqualTo(new BigDecimal("2.50")); // Standardize scale check
        
        assertThat(results.get(0).getCompetence().getCompetenceId()).isEqualTo(savedCompetence.getCompetenceId());
    }
}