package com.iv1201.recruitment.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.iv1201.recruitment.dto.ApplicationSummaryDTO;

import java.util.List;
/**
 * REST controller for handling recruitment applications.
 * 
 * Exposes endpoints for recruiters to list applications and,¨
 * in the future, to update application statuses.
 */

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    /**
     * Retrieve a list of all recruitment applications.
     * 
     * @return
     */
    @GetMapping
    public ResponseEntity<List<ApplicationSummaryDTO>> getAllApplications() {
        // Temporary mock response
        ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
        dto.setPersonID(1L);
        dto.setFullName("John Doe");
        dto.setStatus("UNHANDLED");

        return ResponseEntity.ok(List.of(dto));
    }
    
}
