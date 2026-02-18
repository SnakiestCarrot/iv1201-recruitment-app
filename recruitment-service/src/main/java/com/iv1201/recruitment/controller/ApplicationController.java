package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.ApplicationDetailDTO;
import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.dto.ApplicationsCreateDTO;
import com.iv1201.recruitment.dto.StatusUpdateDTO;
import com.iv1201.recruitment.service.ApplicationService;
import jakarta.validation.Valid;
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
    public ResponseEntity<Void> submitApplication(@Valid @RequestBody ApplicationsCreateDTO applicationDTO, 
                                                  @RequestHeader(value = "X-User-ID", required = false) Long userIdHeader) {
        
        // PRODUCTION FIX: Fail loudly if the header is missing
        if (userIdHeader == null) {
            // 401 Unauthorized is appropriate as the Gateway should have authenticated them
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID header missing");
        }
        
        applicationService.createApplication(applicationDTO, userIdHeader);
        return ResponseEntity.status(201).build();
    }

    /**
     * Returns the full details of the currently authenticated user's application.
     *
     * @param userIdHeader the authenticated user's ID forwarded by the Gateway
     * @return the application detail DTO
     */
    @GetMapping("/me")
    public ResponseEntity<ApplicationDetailDTO> getMyApplication(
            @RequestHeader(value = "X-User-ID", required = false) Long userIdHeader) {

        if (userIdHeader == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID header missing");
        }

        return ResponseEntity.ok(applicationService.getApplicationById(userIdHeader));
    }

    /**
     * Creates or updates the currently authenticated user's application using
     * replace-all semantics for competences and availabilities.
     *
     * @param applicationDTO the application payload
     * @param userIdHeader   the authenticated user's ID forwarded by the Gateway
     * @return 204 No Content on success
     */
    @PutMapping("/me")
    public ResponseEntity<Void> upsertMyApplication(
            @Valid @RequestBody ApplicationsCreateDTO applicationDTO,
            @RequestHeader(value = "X-User-ID", required = false) Long userIdHeader) {

        if (userIdHeader == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID header missing");
        }

        applicationService.upsertApplicationReplaceAll(applicationDTO, userIdHeader);
        return ResponseEntity.noContent().build();
    }

    /**
     * Returns the full details of a specific application.
     *
     * @param id the person ID of the application to retrieve
     * @return the application detail DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDetailDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    /**
     * Updates the status of a specific application.
     *
     * @param id the person ID of the application to update
     * @param statusUpdateDTO the new status value
     * @return 200 OK on success
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateApplicationStatus(@PathVariable Long id,
                                                         @Valid @RequestBody StatusUpdateDTO statusUpdateDTO) {
        applicationService.updateApplicationStatus(id, statusUpdateDTO.getStatus(), statusUpdateDTO.getVersion());
        return ResponseEntity.ok().build();
    }
}