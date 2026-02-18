package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.ApplicationDetailDTO;
import com.iv1201.recruitment.dto.ApplicationSummaryDTO;
import com.iv1201.recruitment.service.ApplicationService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ApplicationController.class)
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationService applicationService;

    @Test
    void getAllApplications_returnsListOfApplicationSummaries() throws Exception {
        ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
        dto.setPersonID(1L);
        dto.setFullName("Gustav Grahn");
        dto.setStatus("UNHANDLED");

        when(applicationService.getAllApplications()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/recruitment/applications"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].personID").value(1))
            .andExpect(jsonPath("$[0].fullName").value("Gustav Grahn"))
            .andExpect(jsonPath("$[0].status").value("UNHANDLED"));
    }

    @Test
    void submitApplication_withUserHeader_callsServiceAndReturns201() throws Exception {
        mockMvc.perform(post("/api/recruitment/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .header("X-User-ID", "42"))
            .andExpect(status().isCreated());

        verify(applicationService).createApplication(any(), eq(42L));
    }

    @Test
    void submitApplication_missingUserHeader_returns401() throws Exception {
        mockMvc.perform(post("/api/recruitment/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getMyApplication_withUserHeader_returnsDetailDto() throws Exception {
        ApplicationDetailDTO detail = new ApplicationDetailDTO();
        detail.setPersonID(42L);
        detail.setName("Alice");
        detail.setSurname("Doe");

        when(applicationService.getApplicationById(42L)).thenReturn(detail);

        mockMvc.perform(get("/api/recruitment/applications/me")
                .header("X-User-ID", "42"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.personID").value(42))
            .andExpect(jsonPath("$.name").value("Alice"))
            .andExpect(jsonPath("$.surname").value("Doe"));
    }

    @Test
    void getMyApplication_missingUserHeader_returns401() throws Exception {
        mockMvc.perform(get("/api/recruitment/applications/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void upsertMyApplication_withUserHeader_callsServiceAndReturns204() throws Exception {
        mockMvc.perform(put("/api/recruitment/applications/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .header("X-User-ID", "7"))
            .andExpect(status().isNoContent());

        verify(applicationService).upsertApplicationReplaceAll(any(), eq(7L));
    }

    @Test
    void upsertMyApplication_missingUserHeader_returns401() throws Exception {
        mockMvc.perform(put("/api/recruitment/applications/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getApplicationById_returnsDetailDto() throws Exception {
        ApplicationDetailDTO detail = new ApplicationDetailDTO();
        detail.setPersonID(5L);
        detail.setName("Bob");
        detail.setSurname("Builder");

        when(applicationService.getApplicationById(5L)).thenReturn(detail);

        mockMvc.perform(get("/api/recruitment/applications/5"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.personID").value(5))
            .andExpect(jsonPath("$.name").value("Bob"))
            .andExpect(jsonPath("$.surname").value("Builder"));
    }

    @Test
    void updateApplicationStatus_callsServiceAndReturns200() throws Exception {
        mockMvc.perform(put("/api/recruitment/applications/9/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"ACCEPTED\",\"version\":1}"))
            .andExpect(status().isOk());

        verify(applicationService).updateApplicationStatus(9L, "ACCEPTED", 1L);
    }
}

