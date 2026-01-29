package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.dto.ApplicationsCreateDTO;
import com.iv1201.recruitment.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/recruitment/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationSummaryDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    /**
     * Submits a new recruitment application.
     * Expects a header 'X-User-ID' forwarded by the Gateway.
     */
    @PostMapping
    public ResponseEntity<Void> submitApplication(@RequestBody ApplicationsCreateDTO applicationDTO, 
                                                  @RequestHeader(value = "X-User-ID", required = false) Long userIdHeader) {
        
        // PRODUCTION FIX: Fail loudly if the header is missing
        if (userIdHeader == null) {
            // 401 Unauthorized is appropriate as the Gateway should have authenticated them
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID header missing");
        }
        
        applicationService.createApplication(applicationDTO, userIdHeader);
        return ResponseEntity.status(201).build();
    }
}