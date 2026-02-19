package com.iv1201.recruitment.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.service.CompetenceService;

import java.util.List;
import java.math.BigDecimal;

/**
 * REST controller for handling competences related to recruitment applications.
 * 
 * Provides endpoints used to retrieve competences and years of experience
 * submitted by the applicants.
 */

@RestController
@RequestMapping("api/recruitment/competences")
public class CompetenceController {


    private final CompetenceService competenceService;

    /**
     * @param competenceService the service for competence operations.
     */
    public CompetenceController(CompetenceService competenceService) {
        this.competenceService = competenceService;
    }


    /**
     * Retrieves all competences.
     * 
     * @return list of competence DTOs
     */

    @GetMapping
    public ResponseEntity<List<CompetenceDTO>> getAllCompetences() {
        return ResponseEntity.ok(competenceService.getAllCompetences());
    }
    
}
