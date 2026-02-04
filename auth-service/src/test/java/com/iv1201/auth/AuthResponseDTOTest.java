package com.iv1201.auth;

import org.junit.jupiter.api.Test;

import com.iv1201.auth.dto.AuthResponseDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthResponseDTOTest {

    @Test
    void testSetToken() {
        AuthResponseDTO dto = new AuthResponseDTO("initialToken");

        dto.setToken("newToken");

        assertEquals("newToken", dto.getToken());
    }

    @Test
    void testGetToken() {
        String expectedToken = "testToken123";
        AuthResponseDTO dto = new AuthResponseDTO(expectedToken);

        assertEquals(expectedToken, dto.getToken());
    }
}