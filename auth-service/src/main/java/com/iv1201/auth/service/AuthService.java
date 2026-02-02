package com.iv1201.auth.service;

import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.integration.UserRepository;
import com.iv1201.auth.model.User;
import com.iv1201.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${recruiter.secret.code}")
    private String recruiterSecretCode;

    /**
     * Constructor injection for dependencies.
     *
     * @param userRepository  The database interface.
     * @param passwordEncoder The BCrypt password hasher.
     * @param jwtUtil         The utility to generate JWT tokens.
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registers a new applicant.
     *
     * @param request The registration data.
     * @throws IllegalArgumentException If the username is already taken.
     */
    public void register(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRoleId(2L);

        userRepository.save(user);
    }

    /**
     * Registers a new recruiter with a secret code.
     *
     * @param request The registration data including secret code.
     * @throws IllegalArgumentException If the secret code is invalid or username is taken.
     */
    public void registerRecruiter(RecruiterRegisterRequestDTO request) {
        // Validate secret code
        if (request.getSecretCode() == null || !request.getSecretCode().equals(recruiterSecretCode)) {
            throw new IllegalArgumentException("Invalid registration code");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

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
     * @throws IllegalArgumentException If credentials are invalid.
     */
    public String login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));;

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Invalid credentials");
            }

        return jwtUtil.generateToken(user);
    }
}