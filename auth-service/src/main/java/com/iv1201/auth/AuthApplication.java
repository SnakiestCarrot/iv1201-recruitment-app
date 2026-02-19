package com.iv1201.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Authentication microservice.
 */
@SpringBootApplication
public class AuthApplication {
    /**
     * Starts the Spring Boot application.
     *
     * @param args command-line arguments.
     */
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }
}