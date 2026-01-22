package com.iv1201.recruitment.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.iv1201.recruitment.dto.CompetenceDTO;

import java.util.List;
import java.math.BigDecimal;

/**
 * REST controller for handling competences related to recruitment applications.
 * 
 * Provides endpoints used to retrieve competences and years of experience
 * submitted by the applicants.
 */

@RestController
@RequestMapping("/competences")
public class CompetenceController {
    /**
     * Retrieves all competences.
     * 
     * @return
     */

    @GetMapping
    public ResponseEntity<List<CompetenceDTO>> getAllCompetences() {
        // Temporary mock response
        CompetenceDTO dto = new CompetenceDTO();
        dto.setCompetenceId(1L);
        dto.setYearsOfExperience(new BigDecimal("5.0"));

        return ResponseEntity.ok(List.of(dto));
    }
    
}
