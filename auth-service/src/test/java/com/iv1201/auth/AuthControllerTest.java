package com.iv1201.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iv1201.auth.controller.AuthController;
import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void shouldReturnBadRequest_WhenRegisterFails() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("takenUser");
        request.setPassword("pass");

        doThrow(new IllegalArgumentException("Username is already taken"))
            .when(authService).register(any(RegisterRequestDTO.class));

        mockMvc.perform(post("/auth/register")
                .with(csrf()) 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username is already taken"));
    }

    @Test
    @WithMockUser
    public void shouldReturnForbidden_WhenRecruiterCodeIsInvalid() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setSecretCode("wrongCode");

        doThrow(new IllegalArgumentException("Invalid registration code"))
            .when(authService).registerRecruiter(any(RecruiterRegisterRequestDTO.class));

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Invalid registration code"));
    }

    @Test
    @WithMockUser
    public void shouldReturnBadRequest_WhenRecruiterUsernameTaken() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("takenRecruiter");
        request.setSecretCode("correctCode");

        doThrow(new IllegalArgumentException("Username is already taken"))
            .when(authService).registerRecruiter(any(RecruiterRegisterRequestDTO.class));

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username is already taken"));
    }

    @Test
    @WithMockUser
    public void shouldReturnUnauthorized_WhenLoginCredentialsInvalid() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("user");
        request.setPassword("wrongPass");

        when(authService.login(any(LoginRequestDTO.class)))
            .thenThrow(new IllegalArgumentException("Invalid credentials"));

        mockMvc.perform(post("/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    @Test
    @WithMockUser
    public void shouldReturnInternalServerError_WhenUnexpectedErrorOccurs() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("user");
        request.setPassword("pass");

        when(authService.login(any(LoginRequestDTO.class)))
            .thenThrow(new RuntimeException("Database connection failed"));

        mockMvc.perform(post("/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError()) 
                .andExpect(content().string("Internal Server Error"));
    }
}