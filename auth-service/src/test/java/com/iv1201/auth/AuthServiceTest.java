package com.iv1201.auth;

import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.integration.UserRepository;
import com.iv1201.auth.model.User;
import com.iv1201.auth.service.AuthService;
import com.iv1201.auth.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "recruitmentServiceUrl", "http://recruitment-service:8080");
    }

    private RegisterRequestDTO createRegisterRequest() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setEmail("test@example.com");
        request.setPnr("19900101-1234");
        return request;
    }

    @Test
    void testRegister_Success() {
        RegisterRequestDTO request = createRegisterRequest();

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(42L);
            return user;
        });
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Void.class)))
                .thenReturn(ResponseEntity.status(201).build());

        authService.register(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(userRepository, times(1)).flush();
        verify(restTemplate, times(1)).postForEntity(
                eq("http://recruitment-service:8080/api/recruitment/persons"),
                any(HttpEntity.class),
                eq(Void.class)
        );
    }

    @Test
    void testRegister_SagaCompensation_WhenRecruitmentServiceFails() {
        RegisterRequestDTO request = createRegisterRequest();

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(42L);
            return user;
        });
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Void.class)))
                .thenThrow(new RuntimeException("Connection refused"));

        assertThrows(RuntimeException.class, () -> authService.register(request));

        // Verify compensating transaction: user is deleted
        verify(userRepository, times(1)).delete(any(User.class));
    }

    private RecruiterRegisterRequestDTO createRecruiterRegisterRequest() {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("newRecruiter");
        request.setPassword("password123");
        request.setEmail("recruiter@example.com");
        request.setPnr("19900101-1234");
        request.setSecretCode("correctCode");
        return request;
    }

    @Test
    void testRegisterRecruiter_Success() {
        RecruiterRegisterRequestDTO request = createRecruiterRegisterRequest();

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(99L);
            return user;
        });
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Void.class)))
                .thenReturn(ResponseEntity.status(201).build());

        authService.registerRecruiter(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(userRepository, times(1)).flush();
        verify(restTemplate, times(1)).postForEntity(
                eq("http://recruitment-service:8080/api/recruitment/persons"),
                any(HttpEntity.class),
                eq(Void.class)
        );
    }

    @Test
    void testRegisterRecruiter_SagaCompensation_WhenRecruitmentServiceFails() {
        RecruiterRegisterRequestDTO request = createRecruiterRegisterRequest();

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(99L);
            return user;
        });
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Void.class)))
                .thenThrow(new RuntimeException("Connection refused"));

        assertThrows(RuntimeException.class, () -> authService.registerRecruiter(request));

        // Verify compensating transaction: user is deleted
        verify(userRepository, times(1)).delete(any(User.class));
    }

    @Test
    void testLogin_Success() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("testUser");
        request.setPassword("password123");

        User mockUser = new User();
        mockUser.setUsername("testUser");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("testUser", "password123"));
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken(mockUser)).thenReturn("jwtToken");

        String token = authService.login(request);

        assertNotNull(token);
        assertEquals("jwtToken", token);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil, times(1)).generateToken(mockUser);
    }

    @Test
    void testLogin_UserNotFound_ShouldThrowException() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("unknownUser");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("unknownUser", "password123"));
        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}
