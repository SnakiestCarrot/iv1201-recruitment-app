package com.iv1201.auth.dto;

/**
 * Data Transfer Object representing an authentication response.
 * This class encapsulates the security token returned upon a successful authentication attempt.
 */
public class AuthResponseDTO {
    
    /**
     * The authentication token.
     */
    private String token;

    /**
     * Constructs a new AuthResponseDTO with the specified token.
     * * @param token the authentication token to be wrapped in this DTO
     */
    public AuthResponseDTO(String token) {
        this.token = token;
    }

    /**
     * Retrieves the authentication token.
     * * @return the current authentication token string
     */
    public String getToken() { 
        return token; 
    }

    /**
     * Sets the authentication token.
     * * @param token the authentication token string to set
     */
    public void setToken(String token) { 
        this.token = token; 
    }
}