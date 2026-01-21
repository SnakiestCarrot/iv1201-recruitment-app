package com.recruitment.microservices.recruitment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RecruitmentServiceApplication {

	public static void main(String[] args) {
		System.out.println("Starting Recruitment Service...");
		SpringApplication.run(RecruitmentServiceApplication.class, args);
		System.out.println("Recruitment Service started successfully.");
	}

}
