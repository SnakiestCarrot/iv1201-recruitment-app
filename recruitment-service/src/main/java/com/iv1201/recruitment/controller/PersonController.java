package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.PersonCreateDTO;
import com.iv1201.recruitment.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for person record management.
 * Provides an internal endpoint used by the auth service during the
 * registration saga to create a person record in the recruitment database.
 */
@RestController
@RequestMapping("api/recruitment/persons")
public class PersonController {

    private final ApplicationService applicationService;

    public PersonController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Creates a new person record in the recruitment database.
     * Called internally by the auth service as part of the registration saga.
     *
     * @param dto the person data containing personId, email, and pnr
     * @return 201 Created on success
     */
    @PostMapping
    public ResponseEntity<Void> createPerson(@RequestBody PersonCreateDTO dto) {
        applicationService.createPerson(dto);
        return ResponseEntity.status(201).build();
    }
}
