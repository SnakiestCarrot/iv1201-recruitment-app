package com.iv1201.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.dto.LoginRequestDTO; // <--- CHANGED THIS IMPORT
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "recruiter.secret.code=TEST_SECRET_CODE"
})
@Transactional
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequestDTO newUser = new RegisterRequestDTO();
        newUser.setUsername("TestUser");
        newUser.setPassword("TestPass123");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    public void shouldLoginAndReturnToken() throws Exception {
        // 1. Register first
        RegisterRequestDTO newUser = new RegisterRequestDTO();
        newUser.setUsername("LoginUser");
        newUser.setPassword("LoginPass123");
        
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)));

        // 2. Try to Login using LoginRequestDTO
        LoginRequestDTO loginRequest = new LoginRequestDTO(); // <--- UPDATED CLASS NAME
        loginRequest.setUsername("LoginUser");
        loginRequest.setPassword("LoginPass123");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    public void shouldRejectWrongPassword() throws Exception {
        // 1. Register
        RegisterRequestDTO newUser = new RegisterRequestDTO();
        newUser.setUsername("WrongPassUser");
        newUser.setPassword("CorrectPass");
        
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)));

        // 2. Try Login with WRONG password using LoginRequestDTO
        LoginRequestDTO loginRequest = new LoginRequestDTO(); // <--- UPDATED CLASS NAME
        loginRequest.setUsername("WrongPassUser");
        loginRequest.setPassword("WrongPass");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void shouldProtectSecretEndpoints() throws Exception {
        mockMvc.perform(get("/auth/secret-data"))
                .andExpect(status().isForbidden()); 
    }
}