package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.model.Person;
import com.iv1201.recruitment.repository.PersonRepository;

import com.iv1201.recruitment.service.ApplicationService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private PersonRepository personRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @Test
    void getAllApplications_returnsMappedDTOs() {
        Person person = new Person();
        person.setName("Gustav");
        person.setSurname("Grahn");

        when(personRepository.findAll()).thenReturn(List.of(person));

        List<ApplicationSummaryDTO> result = applicationService.getAllApplications();

        assertThat(result).hasSize(1);

        ApplicationSummaryDTO dto = result.get(0);
        assertThat(dto.getPersonID()).isNull();
        assertThat(dto.getFullName()).isEqualTo("Gustav Grahn");
        assertThat(dto.getStatus()).isEqualTo("UNHANDLED");
    }
}
