package com.iv1201.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handles validation errors (e.g., Username taken, Invalid code format)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        
        return ResponseEntity.badRequest().body(errors);
    }

    // Handles Spring Security authentication failures
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    // Handles logic errors from AuthService (e.g. Invalid Login, User not found)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        String message = e.getMessage();

        // 1. Login failed -> 401 Unauthorized
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
    
    // Catch-all for unexpected errors (prevents 500 stack traces)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
    }
}