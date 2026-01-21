package com.recruitment.microservices.recruitment;

import org.springframework.boot.SpringApplication;

public class TestRecruitmentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(RecruitmentServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
