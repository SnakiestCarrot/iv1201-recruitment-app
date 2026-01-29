package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Person;

import com.iv1201.recruitment.repository.PersonRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class PersonRepositoryTest {

    @Autowired
    private PersonRepository personRepository;

    @Test
    void saveAndFindPerson() {
        Person person = new Person();
        person.setName("Gustav");
        person.setSurname("Grahn");
        person.setEmail("gustav.grahn@test.com");
        person.setPnr("199001011234");
        person.setUsername("ggrahn");

        Person saved = personRepository.save(person);

        assertThat(saved.getId()).isNotNull();

        Person found = personRepository.findById(saved.getId()).orElseThrow();
        assertThat(found.getName()).isEqualTo("Gustav");
        assertThat(found.getSurname()).isEqualTo("Grahn");
        assertThat(found.getEmail()).isEqualTo("gustav.grahn@test.com");
        assertThat(found.getPnr()).isEqualTo("199001011234");
        assertThat(found.getUsername()).isEqualTo("ggrahn");
    }
}

