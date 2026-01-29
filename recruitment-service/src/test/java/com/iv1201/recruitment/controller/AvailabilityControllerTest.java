package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.AvailabilityDTO;
import com.iv1201.recruitment.service.AvailabilityService;

import com.iv1201.recruitment.controller.AvailabilityController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AvailabilityController.class)
class AvailabilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AvailabilityService availabilityService;

    @Test
    void getAllAvailabilities_returnsOkAndJson() throws Exception {
        AvailabilityDTO dto = new AvailabilityDTO();
        dto.setFromDate(LocalDate.of(2023, 1, 1));
        dto.setToDate(LocalDate.of(2023, 12, 31));

        when(availabilityService.getAllAvailabilities())
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/recruitment/availabilities"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].fromDate").value("2023-01-01"))
                .andExpect(jsonPath("$[0].toDate").value("2023-12-31"));
    }
}

