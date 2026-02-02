package com.iv1201.auth.dto;

/**
 * Data Transfer Object for recruiter registration.
 * Includes a secret code field to restrict registration.
 */
public class RecruiterRegisterRequestDTO {

    private String username;
    private String password;
    private String secretCode;

    /**
     * Gets the username.
     * @return The username.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username.
     * @param username The desired username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the password.
     * @return The password.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password.
     * @param password The raw password.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the secret registration code.
     * @return The secret code.
     */
    public String getSecretCode() {
        return secretCode;
    }

    /**
     * Sets the secret registration code.
     * @param secretCode The code required for recruiter registration.
     */
    public void setSecretCode(String secretCode) {
        this.secretCode = secretCode;
    }
}
