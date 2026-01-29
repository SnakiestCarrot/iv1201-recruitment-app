package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.AvailabilityDTO;
import com.iv1201.recruitment.model.Availability;
import com.iv1201.recruitment.repository.AvailabilityRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceTest {

    @Mock
    private AvailabilityRepository availabilityRepository;

    @InjectMocks
    private AvailabilityService availabilityService;

    @Test
    void getAllAvailabilities_returnsMappedDTOs() {
        Availability availability = new Availability();
        availability.setFromDate(LocalDate.of(2023, 1, 1));
        availability.setToDate(LocalDate.of(2023, 12, 31));

        when(availabilityRepository.findAll())
                .thenReturn(List.of(availability));

        List<AvailabilityDTO> result = availabilityService.getAllAvailabilities();

        assertThat(result).hasSize(1);

        AvailabilityDTO dto = result.get(0);
        assertThat(dto.getFromDate()).isEqualTo(LocalDate.of(2023, 1, 1));
        assertThat(dto.getToDate()).isEqualTo(LocalDate.of(2023, 12, 31));
    }
}

