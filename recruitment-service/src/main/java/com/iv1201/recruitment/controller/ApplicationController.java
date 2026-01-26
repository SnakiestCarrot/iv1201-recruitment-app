package com.iv1201.recruitment.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.service.ApplicationService;

import java.util.List;
/**
 * REST controller for handling recruitment applications.
 * 
 * Exposes endpoints for recruiters to list applications and,¨
 * in the future, to update application statuses.
 */

@RestController
@RequestMapping("api/recruitment/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Retrieve a list of all recruitment applications.
     * 
     * @return list of application summary DTOs
     */

    @GetMapping
    public ResponseEntity<List<ApplicationSummaryDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
    
}
