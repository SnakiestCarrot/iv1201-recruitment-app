package com.iv1201.recruitment.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.math.BigDecimal;

import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.model.Competence;
import com.iv1201.recruitment.repository.CompetenceRepository;

/**
 * Service responsible for retrieving and transforming competence data.
 *
 * This service provides read access to stored Competence entities and converts
 * them into CompetenceDTO objects suitable for transfer to higher layers such
 * as controllers or clients. The mapping ensures a consistent DTO structure
 * independent of the persistence model.
 */
@Service
public class CompetenceService {

    private final CompetenceRepository competenceRepository;

    /**
     * Creates the service with the repository used to access competence data.
     *
     * @param competenceRepository repository managing Competence entities
     */
    public CompetenceService(CompetenceRepository competenceRepository) {
        this.competenceRepository = competenceRepository;
    }

    /**
     * Retrieves all stored competences and converts them into DTO form.
     *
     * Each Competence entity is mapped to a CompetenceDTO using the internal
     * mapping method. The returned list represents the full set of competences
     * available in the system at the time of the call.
     *
     * @return a list of CompetenceDTO objects representing all competences
     */
    public List<CompetenceDTO> getAllCompetences() {
        return competenceRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    /**
     * Converts a Competence entity into a CompetenceDTO.
     *
     * The DTO contains the competence identifier and name from the entity.
     * Years of experience is initialized to zero, since this value is not
     * inherent to the competence itself but instead provided later in the
     * application workflow when linked to a specific person.
     *
     * @param competence the entity to convert
     * @return a DTO representing the provided competence
     */
    private CompetenceDTO mapToDTO(Competence competence) {
        CompetenceDTO dto = new CompetenceDTO();

        dto.setCompetenceId(competence.getCompetenceId());
        dto.setName(competence.getName());
        dto.setYearsOfExperience(BigDecimal.ZERO);

        return dto;
    }
}