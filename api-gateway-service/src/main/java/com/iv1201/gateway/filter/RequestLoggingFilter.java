package com.iv1201.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import reactor.core.publisher.Mono;

@Configuration
public class RequestLoggingFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Bean
    @Order(-1) // make sure this filter is applied early when request comes in
    public GlobalFilter globalLogger() {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();
            String method = exchange.getRequest().getMethod().name();
            String source = exchange.getRequest().getRemoteAddress() != null 
                          ? exchange.getRequest().getRemoteAddress().toString() 
                          : "Unknown";

            logger.info("Incoming Request: [Method: {}] [Path: {}] [Source: {}]", method, path, source);

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                logger.info("Response Status: {}", exchange.getResponse().getStatusCode());
            }));
        };
    }
}