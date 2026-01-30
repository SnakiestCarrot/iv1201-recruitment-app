package com.iv1201.gateway.config;

import com.iv1201.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthenticationFilter authFilter) {
        return builder.routes()
            // Auth Service Routes (Public - No Auth Filter)
            .route("auth-service", r -> r
                .path("/auth/**")
                .uri("http://auth-service:8080"))

            // Recruitment Service Routes (Protected - Uses Auth Filter)
            .route("recruitment-service", r -> r
                .path("/api/recruitment/**")
                //.filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(System.getenv("RECRUITMENT_SERVICE_URL") != null ? 
                    System.getenv("RECRUITMENT_SERVICE_URL") : "http://recruitment-service:8080"))

            .build();
    }
}