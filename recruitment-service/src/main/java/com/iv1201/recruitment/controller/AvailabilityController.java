package com.iv1201.recruitment.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.iv1201.recruitment.dto.AvailabilityDTO;

import java.util.List;
import java.time.LocalDate;

/**
 * REST controller for handling availabilities related to recruitment applications.
 * 
 * This controller exposes endpoints used by the recruitment frontedn to
 * retrieve availability information.
 */

@RestController
@RequestMapping("/availabilities")
public class AvailabilityController {

    /**
     * Retrieves all availability periods.
     * 
     * @return
     */

    @GetMapping
    public ResponseEntity<List<AvailabilityDTO>> getAllAvailabilities() {
        // Temporary mock response
        AvailabilityDTO dto = new AvailabilityDTO();
        dto.setFromDate(LocalDate.of(2023, 1, 1));
        dto.setToDate(LocalDate.of(2023, 12, 31));

        return ResponseEntity.ok(List.of(dto));
    }
    
}
