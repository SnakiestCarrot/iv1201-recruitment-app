package com.iv1201.recruitment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iv1201.recruitment.dto.UpdateProfileDTO;
import com.iv1201.recruitment.service.ApplicationService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProfileController.class)
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationService applicationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void updateProfile_returnsOk_whenSuccessful() throws Exception {
        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("new@mail.com");
        dto.setPnr("199001011234");

        mockMvc.perform(put("/api/recruitment/profile")
                .header("X-User-ID", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(applicationService).updateUserProfile(eq(1L), any(UpdateProfileDTO.class));
    }

    @Test
    void updateProfile_returnsUnauthorized_whenHeaderMissing() throws Exception {
        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("new@mail.com");

        mockMvc.perform(put("/api/recruitment/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(applicationService);
    }

    @Test
    void updateProfile_returnsBadRequest_whenServiceThrows400() throws Exception {
        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("taken@mail.com");

        doThrow(new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST))
                .when(applicationService)
                .updateUserProfile(eq(1L), any(UpdateProfileDTO.class));

        mockMvc.perform(put("/api/recruitment/profile")
                .header("X-User-ID", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProfile_returnsNotFound_whenServiceThrows404() throws Exception {
        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.setEmail("test@mail.com");

        doThrow(new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND))
                .when(applicationService)
                .updateUserProfile(eq(99L), any(UpdateProfileDTO.class));

        mockMvc.perform(put("/api/recruitment/profile")
                .header("X-User-ID", 99L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }
}

