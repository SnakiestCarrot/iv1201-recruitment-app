package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.*;
import com.iv1201.recruitment.model.*;
import com.iv1201.recruitment.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service that handles the core workflow for recruitment applications.
 *
 * This service creates or updates applicant information, stores related
 * competences and availability periods, and provides summarized views of
 * submitted applications for use by higher layers such as controllers.
 *
 * All public operations run inside a transactional context. If an unchecked
 * exception occurs during execution, database changes are typically rolled back.
 *
 * When an application is created or updated and the person's status is not yet
 * set, the status is initialized to "UNHANDLED".
 */
@Service
@Transactional
public class ApplicationService {

    private final PersonRepository personRepository;
    private final CompetenceRepository competenceRepository;
    private final CompetenceProfileRepository competenceProfileRepository;
    private final AvailabilityRepository availabilityRepository;

    /**
     * Creates the service with the required repositories used for persistence.
     *
     * @param personRepository repository managing Person entities
     * @param competenceRepository repository managing Competence entities
     * @param competenceProfileRepository repository managing CompetenceProfile entities
     * @param availabilityRepository repository managing Availability entities
     */
    public ApplicationService(PersonRepository personRepository,
                              CompetenceRepository competenceRepository,
                              CompetenceProfileRepository competenceProfileRepository,
                              AvailabilityRepository availabilityRepository) {
        this.personRepository = personRepository;
        this.competenceRepository = competenceRepository;
        this.competenceProfileRepository = competenceProfileRepository;
        this.availabilityRepository = availabilityRepository;
    }

    /**
     * Returns summary information for all stored recruitment applications.
     *
     * Each Person returned from the repository is transformed into an
     * ApplicationSummaryDTO. The method currently loads all persons into memory,
     * which may require pagination in the future if the dataset grows large.
     *
     * @return a list of application summaries representing all applicants
     */
    public List<ApplicationSummaryDTO> getAllApplications() {
        return personRepository.findAll()
            .stream()
            .map(this::mapToSummaryDTO)
            .collect(Collectors.toList());
    }

    /**
     * Creates or updates a recruitment application for the specified user.
     *
     * The method loads an existing Person by userId or creates a new one if none
     * exists, then copies personal data from the provided DTO and ensures a
     * default status of "UNHANDLED" when no status is set. The person is saved
     * before related competences and availability periods are persisted.
     *
     * Competence entries must reference existing Competence records. If a
     * referenced competence cannot be found, a RuntimeException is thrown and
     * the transaction is expected to roll back. Availability and competence
     * collections may be null, in which case they are simply ignored.
     *
     * This operation writes to multiple repositories and therefore has
     * significant side effects within the database.
     *
     * @param dto the incoming application data containing personal details,
     *            competences, and availability periods
     * @param userId the identifier of the applicant whose application is created or updated
     * @throws RuntimeException if a referenced competence cannot be found
     */
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

    private static final Set<String> VALID_STATUSES = Set.of("UNHANDLED", "ACCEPTED", "REJECTED");

    /**
     * Returns the full details of a specific recruitment application.
     *
     * Loads the Person entity along with their competence profiles and
     * availability periods, then maps all data into an ApplicationDetailDTO.
     *
     * @param id the person ID of the application to retrieve
     * @return a detailed DTO containing all application information
     * @throws ResponseStatusException with 404 status if no person is found
     */
    public ApplicationDetailDTO getApplicationById(Long id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        List<CompetenceProfile> profiles = competenceProfileRepository.findByPerson_Id(id);
        List<Availability> availabilities = availabilityRepository.findByPerson_Id(id);

        ApplicationDetailDTO dto = new ApplicationDetailDTO();
        dto.setPersonID(person.getId());
        dto.setName(person.getName());
        dto.setSurname(person.getSurname());
        dto.setEmail(person.getEmail());
        dto.setPnr(person.getPnr());
        dto.setStatus(person.getStatus() != null ? person.getStatus() : "UNHANDLED");

        dto.setCompetences(profiles.stream().map(p -> {
            CompetenceDTO c = new CompetenceDTO();
            c.setCompetenceId(p.getCompetence().getCompetenceId());
            c.setName(p.getCompetence().getName());
            c.setYearsOfExperience(p.getYearsOfExperience());
            return c;
        }).collect(Collectors.toList()));

        dto.setAvailabilities(availabilities.stream().map(a -> {
            AvailabilityDTO av = new AvailabilityDTO();
            av.setFromDate(a.getFromDate());
            av.setToDate(a.getToDate());
            return av;
        }).collect(Collectors.toList()));

        return dto;
    }

    /**
     * Updates the status of a specific recruitment application.
     *
     * Validates that the new status is one of UNHANDLED, ACCEPTED, or REJECTED.
     * If valid, updates and persists the new status.
     *
     * @param id the person ID of the application to update
     * @param status the new status value
     * @throws ResponseStatusException with 404 if no person is found,
     *         or 400 if the status value is invalid
     */
    public void updateApplicationStatus(Long id, String status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status. Must be one of: UNHANDLED, ACCEPTED, REJECTED");
        }

        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        person.setStatus(status);
        personRepository.save(person);
    }

    /**
     * Converts a Person entity into an ApplicationSummaryDTO.
     *
     * The summary contains the person's identifier, full name created from the
     * stored name and surname, and the current application status. If the status
     * is null, it is represented as "UNHANDLED" in the DTO.
     *
     * @param person the entity to convert
     * @return a populated summary DTO for presentation or transport
     */
    private ApplicationSummaryDTO mapToSummaryDTO(Person person) {
        ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
        dto.setPersonID(person.getId());
        dto.setFullName(person.getName() + " " + person.getSurname());
        dto.setStatus(person.getStatus() != null ? person.getStatus() : "UNHANDLED");
        return dto;
    }
}