package com.iv1201.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration class that provides a RestTemplate bean
 * for making HTTP calls to other microservices.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Creates a RestTemplate bean for inter-service communication.
     *
     * @return A configured RestTemplate instance.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
