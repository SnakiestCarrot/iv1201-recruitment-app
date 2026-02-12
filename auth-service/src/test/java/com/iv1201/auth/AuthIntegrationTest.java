package com.iv1201.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.dto.LoginRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
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

    @MockBean
    private RestTemplate restTemplate;

    private RegisterRequestDTO createRegisterRequest(String username, String password) {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername(username);
        request.setPassword(password);
        request.setEmail(username.toLowerCase() + "@example.com");
        request.setPnr("19900101-1234");
        return request;
    }

    @Test
    public void shouldRegisterUserSuccessfully() throws Exception {
        when(restTemplate.postForEntity(anyString(), any(), eq(Void.class)))
            .thenReturn(ResponseEntity.status(201).build());

        RegisterRequestDTO newUser = createRegisterRequest("TestUser", "TestPass123");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    public void shouldLoginAndReturnToken() throws Exception {
        when(restTemplate.postForEntity(anyString(), any(), eq(Void.class)))
            .thenReturn(ResponseEntity.status(201).build());

        // 1. Register first
        RegisterRequestDTO newUser = createRegisterRequest("LoginUser", "LoginPass123");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)));

        // 2. Try to Login
        LoginRequestDTO loginRequest = new LoginRequestDTO();
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
        when(restTemplate.postForEntity(anyString(), any(), eq(Void.class)))
            .thenReturn(ResponseEntity.status(201).build());

        // 1. Register
        RegisterRequestDTO newUser = createRegisterRequest("WrongPassUser", "CorrectPass");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)));

        // 2. Try Login with WRONG password
        LoginRequestDTO loginRequest = new LoginRequestDTO();
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
                .andExpect(status().isUnauthorized());
    }
}
