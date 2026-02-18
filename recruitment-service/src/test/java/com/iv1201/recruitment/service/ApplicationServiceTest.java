package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.dto.ApplicationsCreateDTO;
import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.dto.AvailabilityDTO;
import com.iv1201.recruitment.dto.PersonCreateDTO;
import com.iv1201.recruitment.dto.UpdateProfileDTO;
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

        verify(competenceProfileRepository).save(argThat(profile -> profile.getPerson() == existingPerson &&
                profile.getCompetence() == mockCompetence &&
                profile.getYearsOfExperience().equals(BigDecimal.valueOf(2.5))));

        verify(availabilityRepository).save(argThat(avail -> avail.getPerson() == existingPerson &&
                avail.getFromDate().equals(LocalDate.parse("2023-01-01"))));
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
    void upsertApplicationReplaceAll_deletesExistingCollectionsAndInsertsNewOnes() {
        ApplicationsCreateDTO dto = mock(ApplicationsCreateDTO.class);
        CompetenceDTO compDto = mock(CompetenceDTO.class);
        AvailabilityDTO availDto = mock(AvailabilityDTO.class);

        when(dto.getName()).thenReturn("Bob");
        when(dto.getSurname()).thenReturn("Builder");

        when(compDto.getCompetenceId()).thenReturn(1L);
        when(compDto.getYearsOfExperience()).thenReturn(BigDecimal.ONE);
        when(dto.getCompetences()).thenReturn(List.of(compDto));

        when(availDto.getFromDate()).thenReturn(LocalDate.parse("2024-01-01"));
        when(availDto.getToDate()).thenReturn(LocalDate.parse("2024-01-31"));
        when(dto.getAvailabilities()).thenReturn(List.of(availDto));

        Person existingPerson = new Person();
        when(personRepository.findById(200L)).thenReturn(Optional.of(existingPerson));

        Competence mockCompetence = new Competence();
        when(competenceRepository.findById(1L)).thenReturn(Optional.of(mockCompetence));

        applicationService.upsertApplicationReplaceAll(dto, 200L);

        verify(personRepository).save(existingPerson);
        assertThat(existingPerson.getName()).isEqualTo("Bob");
        assertThat(existingPerson.getSurname()).isEqualTo("Builder");
        assertThat(existingPerson.getStatus()).isEqualTo("UNHANDLED");

        verify(competenceProfileRepository).deleteByPerson_Id(200L);
        verify(availabilityRepository).deleteByPerson_Id(200L);

        verify(competenceProfileRepository).save(argThat(profile ->
                profile.getPerson() == existingPerson &&
                        profile.getCompetence() == mockCompetence &&
                        profile.getYearsOfExperience().equals(BigDecimal.ONE)));

        verify(availabilityRepository).save(argThat(avail ->
                avail.getPerson() == existingPerson &&
                        avail.getFromDate().equals(LocalDate.parse("2024-01-01")) &&
                        avail.getToDate().equals(LocalDate.parse("2024-01-31"))));
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

    @Test
    void getApplicationById_returnsMappedDetailDto() {
        Person person = new Person();
        person.setId(10L);
        person.setName("Anna");
        person.setSurname("Andersson");
        person.setEmail("anna@example.com");
        person.setPnr("19900101-0000");
        person.setStatus(null);
        person.setVersion(5L);

        Competence competence = new Competence();
        competence.setCompetenceId(3L);
        competence.setName("Java");

        CompetenceProfile profile = new CompetenceProfile();
        profile.setPerson(person);
        profile.setCompetence(competence);
        profile.setYearsOfExperience(BigDecimal.TEN);

        Availability availability = new Availability();
        availability.setPerson(person);
        availability.setFromDate(LocalDate.parse("2024-02-01"));
        availability.setToDate(LocalDate.parse("2024-02-28"));

        when(personRepository.findById(10L)).thenReturn(Optional.of(person));
        when(competenceProfileRepository.findByPerson_Id(10L)).thenReturn(List.of(profile));
        when(availabilityRepository.findByPerson_Id(10L)).thenReturn(List.of(availability));

        var result = applicationService.getApplicationById(10L);

        assertThat(result.getPersonID()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Anna");
        assertThat(result.getSurname()).isEqualTo("Andersson");
        assertThat(result.getEmail()).isEqualTo("anna@example.com");
        assertThat(result.getPnr()).isEqualTo("19900101-0000");
        assertThat(result.getStatus()).isEqualTo("UNHANDLED");
        assertThat(result.getVersion()).isEqualTo(5L);

        assertThat(result.getCompetences()).hasSize(1);
        CompetenceDTO mappedComp = result.getCompetences().get(0);
        assertThat(mappedComp.getCompetenceId()).isEqualTo(3L);
        assertThat(mappedComp.getName()).isEqualTo("Java");
        assertThat(mappedComp.getYearsOfExperience()).isEqualTo(BigDecimal.TEN);

        assertThat(result.getAvailabilities()).hasSize(1);
        AvailabilityDTO mappedAvail = result.getAvailabilities().get(0);
        assertThat(mappedAvail.getFromDate()).isEqualTo(LocalDate.parse("2024-02-01"));
        assertThat(mappedAvail.getToDate()).isEqualTo(LocalDate.parse("2024-02-28"));
    }

    @Test
    void getApplicationById_throwsNotFoundWhenPersonMissing() {
        when(personRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.getApplicationById(999L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(404);
                });
    }


    @Test
    void emailExists_returnsTrue_whenRepositoryReturnsTrue() {
        when(personRepository.existsByEmail("exists@test.com")).thenReturn(true);

        boolean result = applicationService.emailExists("exists@test.com");

        assertThat(result).isTrue();
        verify(personRepository).existsByEmail("exists@test.com");
    }

    @Test
    void emailExists_returnsFalse_whenRepositoryReturnsFalse() {
        when(personRepository.existsByEmail("unknown@test.com")).thenReturn(false);

        boolean result = applicationService.emailExists("unknown@test.com");

        assertThat(result).isFalse();
        verify(personRepository).existsByEmail("unknown@test.com");
    }

    @Test
    void createPerson_savesPersonWithCorrectFields() {
        PersonCreateDTO dto = new PersonCreateDTO();
        dto.setPersonId(42L);
        dto.setEmail("test@example.com");
        dto.setPnr("19900101-1234");

        applicationService.createPerson(dto);

        verify(personRepository).save(argThat(person -> person.getId().equals(42L)
                && "test@example.com".equals(person.getEmail())
                && "19900101-1234".equals(person.getPnr())
                && "UNHANDLED".equals(person.getStatus())));
    }

    @Test
    void updateUserProfile_updatesEmailAndPnr() {
        Person person = new Person();
        person.setId(1L);
        person.setEmail("old@mail.com");
        person.setPnr("123");

        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("new@mail.com");
        dto.setPnr("999");

        when(personRepository.findById(1L)).thenReturn(Optional.of(person));
        when(personRepository.existsByEmail("new@mail.com")).thenReturn(false);

        applicationService.updateUserProfile(1L, dto);

        assertThat(person.getEmail()).isEqualTo("new@mail.com");
        assertThat(person.getPnr()).isEqualTo("999");

        verify(personRepository).save(person);
    }

    @Test
    void updateUserProfile_throwsBadRequest_whenEmailExists() {
        Person person = new Person();
        person.setId(1L);
        person.setEmail("old@mail.com");

        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("taken@mail.com");

        when(personRepository.findById(1L)).thenReturn(Optional.of(person));
        when(personRepository.existsByEmail("taken@mail.com")).thenReturn(true);

        assertThatThrownBy(() -> applicationService.updateUserProfile(1L, dto))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(400);
                });

        verify(personRepository, never()).save(any());
    }

    @Test
    void updateUserProfile_throwsNotFound_whenUserMissing() {
        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("test@mail.com");

        when(personRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.updateUserProfile(99L, dto))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode().value()).isEqualTo(404);
                });
    }
}