package com.iv1201.auth;

import org.junit.jupiter.api.Test;

import com.iv1201.auth.dto.RecruiterRegisterRequestDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class RecruiterRegisterRequestDTOTest {

    @Test
    void testGettersAndSetters() {
        RecruiterRegisterRequestDTO dto = new RecruiterRegisterRequestDTO();

        dto.setUsername("testUser");
        dto.setPassword("testPass");
        dto.setSecretCode("secret123");

        assertEquals("testUser", dto.getUsername());
        assertEquals("testPass", dto.getPassword());
        assertEquals("secret123", dto.getSecretCode());
    }

    @Test
    void testEmptyConstructor() {    
        RecruiterRegisterRequestDTO dto = new RecruiterRegisterRequestDTO();

        assertNull(dto.getUsername());
        assertNull(dto.getPassword());
        assertNull(dto.getSecretCode());
    }
}