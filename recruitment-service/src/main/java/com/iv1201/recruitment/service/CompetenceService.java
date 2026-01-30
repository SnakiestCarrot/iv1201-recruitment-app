package com.iv1201.recruitment.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.math.BigDecimal;

import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.model.Competence;
import com.iv1201.recruitment.repository.CompetenceRepository;

@Service
public class CompetenceService {

    private final CompetenceRepository competenceRepository;

    public CompetenceService(CompetenceRepository competenceRepository) {
        this.competenceRepository = competenceRepository;
    }

    public List<CompetenceDTO> getAllCompetences() {
        return competenceRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CompetenceDTO mapToDTO(Competence competence) {
        CompetenceDTO dto = new CompetenceDTO();
        
        dto.setCompetenceId(competence.getCompetenceId()); 
        
        dto.setName(competence.getName());

        dto.setYearsOfExperience(BigDecimal.ZERO); 
        
        return dto;
    }
}