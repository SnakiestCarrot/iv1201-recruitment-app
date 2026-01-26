package com.iv1201.recruitment.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.model.Person;
import com.iv1201.recruitment.repository.PersonRepository;

/**
 * Service responsible for recruitment application logic.
 */

@Service
public class ApplicationService {

    private final PersonRepository personRepository;

    public ApplicationService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    /** 
     * Retrieves all applications as summary DTOs.
     * 
     * @return List of application summaries.
     */
    public List<ApplicationSummaryDTO> getAllApplications() {
        return personRepository.findAll()
            .stream()
            .map(this::mapToSummaryDTO)
            .collect(Collectors.toList());
    }

    private ApplicationSummaryDTO mapToSummaryDTO(Person person) {
        ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
        dto.setPersonID(person.getId());
        dto.setFullName(person.getName() + " " + person.getSurname());
        dto.setStatus("UNHANDLED"); // Placeholder until status handling is implemented
        return dto;
    }
}
