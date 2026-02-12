package com.iv1201.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

/**
 * Global exception handler for the authentication service.
 * Centralizes error handling and returns consistent error responses 
 * formatted as plain strings to match frontend requirements.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles validation errors (e.g., @NotBlank, @UniqueUsername, @ValidSecretCode).
     * Extracts the error messages and returns them as a single string.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Collect all error messages and join them with a semicolon, or just take the first one
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        // Check if this is a recruiter secret code failure to maintain 403 logic
        if (errorMessage.contains("Invalid registration code")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorMessage);
        }
        
        return ResponseEntity.badRequest().body(errorMessage);
    }

    /**
     * Handles Spring Security authentication failures (wrong password/username).
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    /**
     * Handles business logic errors thrown by AuthService.
     * Maps specific message contents to correct HTTP Status codes.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        String message = e.getMessage();

        // 1. Login failed or User missing -> 401 Unauthorized
        if (message.contains("Invalid credentials") || message.contains("User not found")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
        }

        // 2. Invalid Recruiter Code -> 403 Forbidden
        if (message.contains("Invalid registration code")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
        }

        // 3. Default fallback (e.g. Username taken) -> 400 Bad Request
        return ResponseEntity.badRequest().body(message);
    }
    
    /**
     * Catch-all for unexpected errors to prevent leaking stack traces.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
    }
}