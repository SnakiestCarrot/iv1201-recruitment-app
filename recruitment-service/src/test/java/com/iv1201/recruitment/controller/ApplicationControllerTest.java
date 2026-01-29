package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.service.ApplicationService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationService applicationService;

    @Test
    void getAllApplications_returnsListOfApplicationSummaries() throws Exception {
        // Arrange
        ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
        dto.setPersonID(1L);
        dto.setFullName("Gustav Grahn");
        dto.setStatus("UNHANDLED");

        when(applicationService.getAllApplications()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/recruitment/applications"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].personID").value(1))
            .andExpect(jsonPath("$[0].fullName").value("Gustav Grahn"))
            .andExpect(jsonPath("$[0].status").value("UNHANDLED"));
    }
}

