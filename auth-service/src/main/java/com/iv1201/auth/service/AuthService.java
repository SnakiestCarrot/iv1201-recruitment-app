package com.iv1201.auth.service;

import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.integration.UserRepository;
import com.iv1201.auth.model.User;
import com.iv1201.auth.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for handling authentication business logic.
 * <p>
 * Handles both Registration (creating new users) and Login (verifying credentials).
 * </p>
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Constructor injection for dependencies.
     *
     * @param userRepository  The database interface.
     * @param passwordEncoder The BCrypt password hasher.
     * @param jwtUtil         The utility to generate JWT tokens.
     * @param authenticationManager The Spring Security authentication manager.
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registers a new applicant.
     *
     * @param request The registration data (already validated by @Valid annotation).
     */
    public void register(RegisterRequestDTO request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoleId(2L);

        userRepository.save(user);
    }

    /**
     * Registers a new recruiter with a secret code.
     *
     * @param request The registration data including secret code (already validated by @Valid annotation).
     */
    public void registerRecruiter(RecruiterRegisterRequestDTO request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoleId(1L); // Recruiter role

        userRepository.save(user);
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request The login credentials (username/password).
     * @return A signed JWT token string.
     * @throws org.springframework.security.core.AuthenticationException If credentials are invalid.
     */
    public String login(LoginRequestDTO request) {
        // Delegate authentication to Spring Security's AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // If we get here, authentication was successful. Load user and generate token.
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return jwtUtil.generateToken(user);
    }
}