package com.iv1201.recruitment.service;

import org.springframework.stereotype.Service;
import java.util.List;

import com.iv1201.recruitment.dto.AvailabilityDTO;
import com.iv1201.recruitment.model.Availability;
import com.iv1201.recruitment.repository.AvailabilityRepository;

/**
 * Service responsible for availability related logic.
 */
@Service
public class AvailabilityService {

    private final AvailabilityRepository AvailabilityRepository;
    
    /**
     * Constructs an AvailabilityService with the required repository.
     *
     * @param AvailabilityRepository the availability repository.
     */
    public AvailabilityService(AvailabilityRepository AvailabilityRepository) {
        this.AvailabilityRepository = AvailabilityRepository;
    }

    /** 
     * Retrieves all availability periods as DTOs.
     * 
     * @return List of availability DTOs.
     */
    public List<AvailabilityDTO> getAllAvailabilities() {
        return AvailabilityRepository.findAll()
            .stream()
            .map(a -> {
                AvailabilityDTO dto = new AvailabilityDTO();
                dto.setFromDate(a.getFromDate());
                dto.setToDate(a.getToDate());
                return dto;
            })
            .toList();
    }
}
