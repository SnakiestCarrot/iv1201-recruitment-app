package com.iv1201.recruitment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Recruitment microservice.
 */
@SpringBootApplication
public class RecruitmentApplication {

	/**
	 * Starts the Spring Boot application.
	 *
	 * @param args command-line arguments.
	 */
	public static void main(String[] args) {
		SpringApplication.run(RecruitmentApplication.class, args);
	}

}