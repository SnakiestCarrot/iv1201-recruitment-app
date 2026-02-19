package com.iv1201.gateway.config;

import com.iv1201.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Route configuration for the API gateway.
 * Defines routing rules for auth and recruitment services.
 */
@Configuration
public class RouteConfig {

    /**
     * Configures custom routes for the gateway, applying JWT authentication where required.
     *
     * @param builder the route locator builder.
     * @param authFilter the JWT authentication filter.
     * @return the configured route locator.
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthenticationFilter authFilter) {
        return builder.routes()
            // Auth Service Routes (Public - No Auth Filter)
            .route("auth-service", r -> r
                .path("/auth/**")
                .uri("http://auth-service:8080"))

            // Recruitment Service - Public Routes (No Auth Filter)
            .route("recruitment-competences", r -> r
                .path("/api/recruitment/competences/**")
                .uri(System.getenv("RECRUITMENT_SERVICE_URL") != null ?
                    System.getenv("RECRUITMENT_SERVICE_URL") : "http://recruitment-service:8080"))

            .route("recruitment-migrated-user", r -> r
                .path("/api/recruitment/migrated-user")
                .uri(System.getenv("RECRUITMENT_SERVICE_URL") != null ?
                    System.getenv("RECRUITMENT_SERVICE_URL") : "http://recruitment-service:8080")
            )

            // Recruitment Service - Protected Routes (Uses Auth Filter)
            .route("recruitment-applications", r -> r
                .path("/api/recruitment/applications/**")
                .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(System.getenv("RECRUITMENT_SERVICE_URL") != null ?
                    System.getenv("RECRUITMENT_SERVICE_URL") : "http://recruitment-service:8080"))

            // Recruitment Service - Other Protected Routes (Uses Auth Filter)
            .route("recruitment-service", r -> r
                .path("/api/recruitment/**")
                .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(System.getenv("RECRUITMENT_SERVICE_URL") != null ?
                    System.getenv("RECRUITMENT_SERVICE_URL") : "http://recruitment-service:8080"))

            .build();
    }
}