package com.iv1201.auth.dto;

import com.iv1201.auth.validation.UniqueUsername;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for user registration.
 * Captures the input data sent from the client.
 */
public class RegisterRequestDTO {

    @NotBlank(message = "Username is required")
    @UniqueUsername
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Personal number is required")
    private String pnr;


    /**
     * Sets the username.
     * @param username The desired username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Sets the password.
     * @param password The raw password.
     */
    public void setPassword(String password) {
        this.password = password;
    }


    /**
     * Gets the username.
     * @return The username.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Gets the password.
     * @return The password.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Gets the email.
     * @return The email.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email.
     * @param email The email address.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Gets the personal number.
     * @return The personal number.
     */
    public String getPnr() {
        return pnr;
    }

    /**
     * Sets the personal number.
     * @param pnr The personal number.
     */
    public void setPnr(String pnr) {
        this.pnr = pnr;
    }
}