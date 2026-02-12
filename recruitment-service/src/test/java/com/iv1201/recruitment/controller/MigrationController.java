package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.service.ApplicationService;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MigrationController.class)
class MigrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationService applicationService;

    @Test
    void migratedUserEndpoint_returnsGenericMessage_whenEmailExists() throws Exception {

        String email = "test@mail.com";
        when(applicationService.emailExists(email)).thenReturn(true);

        mockMvc.perform(post("/api/recruitment/migrated-user")
                .contentType("application/json")
                .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(
                        "If this email exists in our system, you will receive password reset instructions shortly."
                ));

        verify(applicationService).emailExists(email);
    }

    @Test
    void migratedUserEndpoint_returnsGenericMessage_whenEmailDoesNotExist() throws Exception {

        String email = "unknown@mail.com";
        when(applicationService.emailExists(email)).thenReturn(false);

        mockMvc.perform(post("/api/recruitment/migrated-user")
                .contentType("application/json")
                .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(
                        "If this email exists in our system, you will receive password reset instructions shortly."
                ));

        verify(applicationService).emailExists(email);
    }
}

