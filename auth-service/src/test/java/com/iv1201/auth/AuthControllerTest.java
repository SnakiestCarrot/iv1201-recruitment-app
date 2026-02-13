package com.iv1201.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iv1201.auth.controller.AuthController;
import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.integration.UserRepository;
import com.iv1201.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@TestPropertySource(properties = "recruiter.secret.code=correctCode")
@WithMockUser
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    public void shouldReturnBadRequest_WhenUsernameIsEmpty() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenPasswordIsEmpty() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }



    @Test
    @WithMockUser
    public void shouldReturnForbidden_WhenRecruiterSecretCodeIsEmpty() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("newRecruiter");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode(""); // Triggers validation

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); 
    }

    @Test
    @WithMockUser
    public void shouldReturnForbidden_WhenRecruiterSecretCodeIsNull() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("newRecruiter");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode(null); // Triggers validation

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldReturnUnauthorized_WhenLoginCredentialsInvalid() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("unknownUser");
        request.setPassword("wrongPassword");

        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("User not found"));

        mockMvc.perform(post("/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void shouldReturnOk_WhenLoginSucceeds() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("testUser");
        request.setPassword("password123");

        when(authService.login(any(LoginRequestDTO.class)))
                .thenReturn("jwtToken123");

        mockMvc.perform(post("/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
    @Test
    @WithMockUser
    public void shouldRegisterRecruiterSuccessfully() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");

        // Mock void method doing nothing (success)
        // No "doThrow", just let it pass

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().string("Recruiter registered successfully"));
    }

    @Test
    @WithMockUser
    public void shouldReturnForbidden_WhenRecruiterCodeInvalid() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");

        // We force the service to throw the exception ANYWAY to test the 403 mapping
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
    public void shouldReturnBadRequest_WhenUsernameTaken() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("takenUser");
        request.setPassword("password123");
        request.setEmail("taken@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");

        // Force a generic IllegalArgumentException (not "Invalid code")
        doThrow(new IllegalArgumentException("Username is already taken"))
            .when(authService).registerRecruiter(any(RecruiterRegisterRequestDTO.class));

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()) // Expect 400
                .andExpect(content().string("Username is already taken"));
    }

    @Test
    @WithMockUser
    public void shouldReturnInternalServerError_OnUnexpectedCrash() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("user");
        request.setPassword("pass");

        // Force a RuntimeException (unexpected crash)
        when(authService.login(any(LoginRequestDTO.class)))
            .thenThrow(new RuntimeException("Database down"));

        mockMvc.perform(post("/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError()) // Expect 500
                .andExpect(content().string("Internal Server Error"));
    }

    @Test
    public void shouldReturnBadRequest_WhenEmailFormatInvalid() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setEmail("invalid-email");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenPnrFormatInvalid() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("1990-01-01");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenPnrYearInvalid() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("18900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenPnrMonthInvalid() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("19901301-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenUsernameTooShort() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("ab");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenUsernameHasInvalidCharacters() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("user@name");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenPasswordTooShort() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("pass1");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnBadRequest_WhenPasswordHasInvalidCharacters() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password<script>");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");

        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    public void shouldReturnBadRequest_WhenRecruiterEmailFormatInvalid() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setPassword("password123");
        request.setEmail("invalid.email");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    public void shouldReturnBadRequest_WhenRecruiterPnrFormatInvalid() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("invalid-pnr");
        request.setSecretCode("correctCode");

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    public void shouldReturnBadRequest_WhenRecruiterUsernameTooShort() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("ab");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    public void shouldReturnBadRequest_WhenRecruiterPasswordTooShort() throws Exception {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setPassword("pass1");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");

        mockMvc.perform(post("/auth/register/recruiter")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}