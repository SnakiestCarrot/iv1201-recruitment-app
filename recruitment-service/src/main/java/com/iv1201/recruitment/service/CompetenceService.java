package com.iv1201.recruitment.service;

import org.springframework.stereotype.Service;

import java.util.List;

import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.model.CompetenceProfile;
import com.iv1201.recruitment.repository.CompetenceProfileRepository;

/**
 * Service responsible for competence-related logic in the recruitment system.
 */
@Service
public class CompetenceService {

    private final CompetenceProfileRepository competenceProfileRepository;

    public CompetenceService(CompetenceProfileRepository competenceProfileRepository) {
        this.competenceProfileRepository = competenceProfileRepository;
    }

    /**
     * Retrieves all competences with years of experience.
     *
     * @return list of competence DTOs
     */
    public List<CompetenceDTO> getAllCompetences() {
        return competenceProfileRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CompetenceDTO mapToDTO(CompetenceProfile competenceProfile) {
        CompetenceDTO dto = new CompetenceDTO();
        dto.setCompetenceId(competenceProfile.getCompetence().getId());
        dto.setYearsOfExperience(competenceProfile.getYearsOfExperience());
        return dto;
    }
}

