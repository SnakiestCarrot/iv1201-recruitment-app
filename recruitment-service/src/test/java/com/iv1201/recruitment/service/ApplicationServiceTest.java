package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.dto.ApplicationsCreateDTO;
import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.dto.AvailabilityDTO;
import com.iv1201.recruitment.model.*;
import com.iv1201.recruitment.repository.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private PersonRepository personRepository;

    @Mock
    private CompetenceRepository competenceRepository;

    @Mock
    private CompetenceProfileRepository competenceProfileRepository;

    @Mock
    private AvailabilityRepository availabilityRepository;

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

    @Test
    void createApplication_savesPersonAndDetails() {
        ApplicationsCreateDTO dto = mock(ApplicationsCreateDTO.class);
        CompetenceDTO compDto = mock(CompetenceDTO.class);
        AvailabilityDTO availDto = mock(AvailabilityDTO.class);

        when(dto.getName()).thenReturn("Alice");
        when(dto.getSurname()).thenReturn("Doe");
        when(dto.getEmail()).thenReturn("alice@example.com");
        when(dto.getPnr()).thenReturn("19900101-1234");
        
        when(compDto.getCompetenceId()).thenReturn(1L);
        when(compDto.getYearsOfExperience()).thenReturn(BigDecimal.valueOf(2.5));
        when(dto.getCompetences()).thenReturn(List.of(compDto));

        when(availDto.getFromDate()).thenReturn(LocalDate.parse("2023-01-01"));
        when(availDto.getToDate()).thenReturn(LocalDate.parse("2023-01-31"));
        when(dto.getAvailabilities()).thenReturn(List.of(availDto));

        Person existingPerson = new Person();
        when(personRepository.findById(100L)).thenReturn(Optional.of(existingPerson));
        
        Competence mockCompetence = new Competence();
        when(competenceRepository.findById(1L)).thenReturn(Optional.of(mockCompetence));

        applicationService.createApplication(dto, 100L);

        verify(personRepository).save(existingPerson);
        assertThat(existingPerson.getName()).isEqualTo("Alice");
        assertThat(existingPerson.getStatus()).isEqualTo("UNHANDLED");

        verify(competenceProfileRepository).save(argThat(profile -> 
            profile.getPerson() == existingPerson &&
            profile.getCompetence() == mockCompetence &&
            profile.getYearsOfExperience().equals(BigDecimal.valueOf(2.5))
        ));

        verify(availabilityRepository).save(argThat(avail -> 
            avail.getPerson() == existingPerson &&
            avail.getFromDate().equals(LocalDate.parse("2023-01-01"))
        ));
    }

    @Test
    void createApplication_handlesNullListsAndExistingStatus() {
        ApplicationsCreateDTO dto = mock(ApplicationsCreateDTO.class);
        
        Person person = new Person();
        person.setStatus("ACCEPTED");
        when(personRepository.findById(100L)).thenReturn(Optional.of(person));

        applicationService.createApplication(dto, 100L);

        verify(personRepository).save(person);
        assertThat(person.getStatus()).isEqualTo("ACCEPTED");

        verifyNoInteractions(competenceRepository);
        verifyNoInteractions(competenceProfileRepository);
        verifyNoInteractions(availabilityRepository);
    }

    @Test
    void createApplication_throwsExceptionWhenCompetenceNotFound() {
        ApplicationsCreateDTO dto = mock(ApplicationsCreateDTO.class);
        CompetenceDTO compDto = mock(CompetenceDTO.class);

        when(compDto.getCompetenceId()).thenReturn(99L);
        when(dto.getCompetences()).thenReturn(List.of(compDto));
        
        when(personRepository.findById(any())).thenReturn(Optional.of(new Person()));
        when(competenceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.createApplication(dto, 1L))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Competence not found");
    }

    @Test
    void updateApplicationStatus_successWhenVersionMatches() {
        Person person = new Person();
        person.setId(1L);
        person.setStatus("UNHANDLED");
        person.setVersion(0L);
        when(personRepository.findById(1L)).thenReturn(Optional.of(person));

        applicationService.updateApplicationStatus(1L, "ACCEPTED", 0L);

        assertThat(person.getStatus()).isEqualTo("ACCEPTED");
        verify(personRepository).save(person);
    }

    @Test
    void updateApplicationStatus_throwsConflictWhenVersionMismatch() {
        Person person = new Person();
        person.setId(1L);
        person.setStatus("UNHANDLED");
        person.setVersion(2L);
        when(personRepository.findById(1L)).thenReturn(Optional.of(person));

        assertThatThrownBy(() -> applicationService.updateApplicationStatus(1L, "ACCEPTED", 1L))
            .isInstanceOf(ResponseStatusException.class)
            .satisfies(ex -> {
                ResponseStatusException rse = (ResponseStatusException) ex;
                assertThat(rse.getStatusCode().value()).isEqualTo(409);
            });

        verify(personRepository, never()).save(any());
    }

    @Test
    void updateApplicationStatus_throwsConflictOnOptimisticLockException() {
        Person person = new Person();
        person.setId(1L);
        person.setStatus("UNHANDLED");
        person.setVersion(0L);
        when(personRepository.findById(1L)).thenReturn(Optional.of(person));
        when(personRepository.save(any())).thenThrow(
            new ObjectOptimisticLockingFailureException(Person.class.getName(), 1L));

        assertThatThrownBy(() -> applicationService.updateApplicationStatus(1L, "ACCEPTED", 0L))
            .isInstanceOf(ResponseStatusException.class)
            .satisfies(ex -> {
                ResponseStatusException rse = (ResponseStatusException) ex;
                assertThat(rse.getStatusCode().value()).isEqualTo(409);
            });
    }
}