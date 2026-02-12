package com.iv1201.auth.controller;

import com.iv1201.auth.dto.AuthResponseDTO;
import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling authentication-related requests.
 * Exposes endpoints for Registration and Login.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for applicant registration.
     * <p>
     * URL: POST /auth/register
     * </p>
     *
     * @param request The JSON body containing username and password.
     * @return 201 Created or 400 Bad Request.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.status(201).body("User registered successfully");
    }

    /**
     * Endpoint for recruiter registration with secret code.
     * <p>
     * URL: POST /auth/register/recruiter
     * </p>
     *
     * @param request The JSON body containing username, password, and secret code.
     * @return 201 Created, 400 Bad Request, or 403 Forbidden.
     */
    @PostMapping("/register/recruiter")
    public ResponseEntity<String> registerRecruiter(@Valid @RequestBody RecruiterRegisterRequestDTO request) {
        authService.registerRecruiter(request);
        return ResponseEntity.status(201).body("Recruiter registered successfully");
    }

    /**
     * Endpoint for user login.
     * <p>
     * URL: POST /auth/login
     * </p>
     *
     * @param request The JSON body containing username and password.
     * @return 200 OK with JWT token.
     * @throws org.springframework.security.core.AuthenticationException If credentials are invalid.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }
}