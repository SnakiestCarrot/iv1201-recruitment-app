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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        // Setup mock behaviors
    }

    @Test
    void testRegister_Success() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("newUser");
        request.setPassword("password123");

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        authService.register(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    void testRegisterRecruiter_Success() {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("newRecruiter");
        request.setPassword("password123");

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        authService.registerRecruiter(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("password123");
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