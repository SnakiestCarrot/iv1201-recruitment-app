package com.iv1201.auth.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; // <--- Import this!
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility for generating signed JWT tokens.
 */
@Component
public class JwtUtil {

    // Spring injects the value from application.properties
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Generates a JWT token containing the user's role and ID as claims.
     *
     * @param user The authenticated user entity.
     * @return A signed JWT string.
     */
    public String generateToken(com.iv1201.auth.model.User user) {
        Map<String, Object> claims = new HashMap<>();
        
        claims.put("role", user.getRoleId());
        claims.put("id", user.getId()); 

        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 Hours
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}