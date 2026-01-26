package com.iv1201.recruitment.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.iv1201.recruitment.dto.AvailabilityDTO;
import com.iv1201.recruitment.service.AvailabilityService;

import java.util.List;
import java.time.LocalDate;

/**
 * REST controller for handling availabilities related to recruitment applications.
 * 
 * This controller exposes endpoints used by the recruitment frontedn to
 * retrieve availability information.
 */

@RestController
@RequestMapping("api/recruitment/availabilities")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    
    /**
     * Retrieves all availability periods.
     *
     * @return list of availability DTOs
     */
    @GetMapping
    public ResponseEntity<List<AvailabilityDTO>> getAllAvailabilities() {
        return ResponseEntity.ok(availabilityService.getAllAvailabilities());
    }
    
}
