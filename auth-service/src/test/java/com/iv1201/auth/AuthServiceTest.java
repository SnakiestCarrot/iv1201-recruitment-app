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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
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

    @InjectMocks
    private AuthService authService;

    private final String TEST_SECRET = "correctSecret";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "recruiterSecretCode", TEST_SECRET);
    }

    @Test
    void testRegister_UsernameAlreadyTaken_ShouldThrowException() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("existingUser");
        request.setPassword("pass");

        when(userRepository.existsByUsername("existingUser")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegisterRecruiter_InvalidSecretCode_ShouldThrowException() {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setSecretCode("wrongSecret"); 

        assertThrows(IllegalArgumentException.class, () -> authService.registerRecruiter(request));
    }

    @Test
    void testRegisterRecruiter_NullSecretCode_ShouldThrowException() {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("recruiter");
        request.setSecretCode(null); 

        assertThrows(IllegalArgumentException.class, () -> authService.registerRecruiter(request));
    }

    @Test
    void testRegisterRecruiter_UsernameAlreadyTaken_ShouldThrowException() {
        RecruiterRegisterRequestDTO request = new RecruiterRegisterRequestDTO();
        request.setUsername("existingRecruiter");
        request.setSecretCode(TEST_SECRET); 

        when(userRepository.existsByUsername("existingRecruiter")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.registerRecruiter(request));
    }

    @Test
    void testLogin_UserNotFound_ShouldThrowException() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("unknownUser");
        request.setPassword("pass");

        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }

    @Test
    void testLogin_WrongPassword_ShouldThrowException() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("validUser");
        request.setPassword("wrongPass");

        User mockUser = new User();
        mockUser.setUsername("validUser");
        mockUser.setPassword("hashedRealPassword");

        when(userRepository.findByUsername("validUser")).thenReturn(Optional.of(mockUser));

        when(passwordEncoder.matches("wrongPass", "hashedRealPassword")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}