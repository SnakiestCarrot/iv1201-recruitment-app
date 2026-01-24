package com.iv1201.auth.controller;

import com.iv1201.auth.dto.AuthResponseDTO;
import com.iv1201.auth.dto.LoginRequestDTO;
import com.iv1201.auth.dto.RegisterRequestDTO;
import com.iv1201.auth.service.AuthService;
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
     * Endpoint for user registration.
     * <p>
     * URL: POST /auth/register
     * </p>
     *
     * @param request The JSON body containing username and password.
     * @return 201 Created or 400 Bad Request.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO request) {
        try {
            authService.register(request);
            return ResponseEntity.status(201).body("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint for user login.
     * <p>
     * URL: POST /auth/login
     * </p>
     *
     * @param request The JSON body containing username and password.
     * @return 200 OK with JWT token, or 401 Unauthorized.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            String token = authService.login(request);
            return ResponseEntity.ok(new AuthResponseDTO(token));
        } catch (IllegalArgumentException e) { 
            return ResponseEntity.status(401).body(e.getMessage());      
        } catch (Exception e) { 
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }
}