package com.iv1201.auth.dto;


/**
 * Data Transfer Object for user registration.
 * Captures the input data sent from the client.
 */
public class RegisterRequestDTO {

    private String username;
    private String password;


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
}