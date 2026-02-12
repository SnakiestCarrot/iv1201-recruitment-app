package com.iv1201.auth.service;

import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.integration.UserRepository;
import com.iv1201.auth.model.User;
import com.iv1201.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Service class for handling authentication business logic.
 * <p>
 * Handles both Registration (creating new users) and Login (verifying credentials).
 * Uses the saga pattern for registration: creates a user locally, then calls
 * the recruitment service to create a matching person record. If the remote call
 * fails, the local user is deleted as a compensating transaction.
 * </p>
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RestTemplate restTemplate;

    @Value("${recruitment.service.url}")
    private String recruitmentServiceUrl;

    /**
     * Constructor injection for dependencies.
     *
     * @param userRepository  The database interface.
     * @param passwordEncoder The BCrypt password hasher.
     * @param jwtUtil         The utility to generate JWT tokens.
     * @param authenticationManager The Spring Security authentication manager.
     * @param restTemplate    The HTTP client for inter-service communication.
     */
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.restTemplate = restTemplate;
    }

    /**
     * Registers a new applicant using the saga pattern.
     * <p>
     * Step 1: Saves the user to the auth database.
     * Step 2: Calls the recruitment service to create a person record with email and pnr.
     * If step 2 fails, the user is deleted from auth-db (compensating transaction).
     * </p>
     *
     * @param request The registration data (already validated by @Valid annotation).
     * @throws RuntimeException If the recruitment service call fails after user creation.
     */
    public void register(RegisterRequestDTO request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoleId(2L);

        userRepository.save(user);
        userRepository.flush();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "personId", user.getId(),
                "email", request.getEmail(),
                "pnr", request.getPnr()
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(
                recruitmentServiceUrl + "/api/recruitment/persons",
                entity,
                Void.class
            );
        } catch (Exception e) {
            // Compensating transaction: remove the user from auth-db
            userRepository.delete(user);
            userRepository.flush();
            throw new RuntimeException(
                "Registration failed: could not create profile in recruitment service"
            );
        }
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
        userRepository.flush();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "personId", user.getId(),
                "email", request.getEmail(),
                "pnr", request.getPnr()
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(
                recruitmentServiceUrl + "/api/recruitment/persons",
                entity,
                Void.class
            );
        } catch (Exception e) {
            userRepository.delete(user);
            userRepository.flush();
            throw new RuntimeException(
                "Registration failed: could not create profile in recruitment service"
            );
        }
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
