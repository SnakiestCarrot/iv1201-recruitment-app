package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Availability;
import com.iv1201.recruitment.model.Person;

import com.iv1201.recruitment.repository.AvailabilityRepository;
import com.iv1201.recruitment.repository.PersonRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class AvailabilityRepositoryTest {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private PersonRepository personRepository;

    @Test
    void saveAndFindAvailability() {
        Person person = new Person();
        person.setName("Gustav");
        person.setSurname("Grahn");
        person.setEmail("gustav@test.com");
        person.setPnr("199001011234");
        person.setUsername("ggrahn");
        person = personRepository.save(person);

        Availability availability = new Availability();
        availability.setPerson(person);
        availability.setFromDate(LocalDate.of(2023, 1, 1));
        availability.setToDate(LocalDate.of(2023, 12, 31));

        Availability saved = availabilityRepository.save(availability);

        assertThat(saved.getId()).isNotNull();

        Availability found =
                availabilityRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getPerson().getId()).isEqualTo(person.getId());
        assertThat(found.getFromDate()).isEqualTo(LocalDate.of(2023, 1, 1));
        assertThat(found.getToDate()).isEqualTo(LocalDate.of(2023, 12, 31));
    }
}

