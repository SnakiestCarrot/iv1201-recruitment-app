package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.dto.ApplicationsCreateDTO;
import com.iv1201.recruitment.model.*;
import com.iv1201.recruitment.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service responsible for recruitment application logic.
 */
@Service
@Transactional
public class ApplicationService {

    private final PersonRepository personRepository;
    private final CompetenceRepository competenceRepository;
    private final CompetenceProfileRepository competenceProfileRepository;
    private final AvailabilityRepository availabilityRepository;

    public ApplicationService(PersonRepository personRepository,
                              CompetenceRepository competenceRepository,
                              CompetenceProfileRepository competenceProfileRepository,
                              AvailabilityRepository availabilityRepository) {
        this.personRepository = personRepository;
        this.competenceRepository = competenceRepository;
        this.competenceProfileRepository = competenceProfileRepository;
        this.availabilityRepository = availabilityRepository;
    }

    public List<ApplicationSummaryDTO> getAllApplications() {
        return personRepository.findAll()
            .stream()
            .map(this::mapToSummaryDTO)
            .collect(Collectors.toList());
    }

    public void createApplication(ApplicationsCreateDTO dto, Long userId) {
        Person person = personRepository.findById(userId).orElse(new Person());
        person.setId(userId);
        person.setName(dto.getName());
        person.setSurname(dto.getSurname());
        person.setEmail(dto.getEmail());
        person.setPnr(dto.getPnr());
        
        if (person.getStatus() == null) {
            person.setStatus("UNHANDLED");
        }
        
        personRepository.save(person);

        if (dto.getCompetences() != null) {
            dto.getCompetences().forEach(compDto -> {
                Competence competence = competenceRepository.findById(compDto.getCompetenceId())
                        .orElseThrow(() -> new RuntimeException("Competence not found"));

                CompetenceProfile profile = new CompetenceProfile();
                profile.setPerson(person);
                profile.setCompetence(competence);
                profile.setYearsOfExperience(compDto.getYearsOfExperience());
                competenceProfileRepository.save(profile);
            });
        }

        if (dto.getAvailabilities() != null) {
            dto.getAvailabilities().forEach(availDto -> {
                Availability availability = new Availability();
                availability.setPerson(person);
                availability.setFromDate(availDto.getFromDate());
                availability.setToDate(availDto.getToDate());
                availabilityRepository.save(availability);
            });
        }
    }

    private ApplicationSummaryDTO mapToSummaryDTO(Person person) {
        ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
        dto.setPersonID(person.getId());
        dto.setFullName(person.getName() + " " + person.getSurname());
        
        dto.setStatus(person.getStatus() != null ? person.getStatus() : "UNHANDLED");
        
        return dto;
    }
}