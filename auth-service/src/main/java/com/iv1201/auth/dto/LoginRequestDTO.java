package com.iv1201.auth.dto;

/**
 * Data Transfer Object representing a login request.
 * This class carries the credentials required for user authentication.
 */
public class LoginRequestDTO {

    /**
     * The unique username or email of the user attempting to authenticate.
     */
    private String username;

    /**
     * The plain-text password provided by the user.
     */
    private String password;

    /**
     * Retrieves the username.
     * * @return the username string.
     */
    public String getUsername() { 
        return username; 
    }

    /**
     * Sets the username.
     * * @param username the username to set.
     */
    public void setUsername(String username) { 
        this.username = username; 
    }

    /**
     * Retrieves the password.
     * * @return the password string.
     */
    public String getPassword() { 
        return password; 
    }

    /**
     * Sets the password.
     * * @param password the password to set.
     */
    public void setPassword(String password) { 
        this.password = password; 
    }
}