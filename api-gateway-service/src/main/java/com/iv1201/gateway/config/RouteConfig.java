package com.iv1201.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Auth Service Routes
            .route("auth-service", r -> r
                .path("/auth/**") // Catch any path starting with /auth
                .uri("http://auth-service:8080")) // Forward to Docker container

            // Recruitment Service Routes
            .route("recruitment-service", r -> r
                .path("/api/recruitment/**") // Example path convention
                .filters(f -> f.stripPrefix(2)) // Remove /api/recruitment prefix before forwarding
                .uri("http://recruitment-service:8080"))

            // Future Services
            // .route("new-service", r -> r.path("/new/**").uri("http://new-service:8080"))

            .build();
    }
}