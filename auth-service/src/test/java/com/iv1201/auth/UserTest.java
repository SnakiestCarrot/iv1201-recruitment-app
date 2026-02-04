package com.iv1201.auth;

import org.junit.jupiter.api.Test;

import com.iv1201.auth.model.User;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testGettersAndSetters() {
        User user = new User();

        user.setId(100L);          
        user.setUsername("test");  
        user.setPassword("pass");   
        user.setRoleId(2L);         


        assertEquals(100L, user.getId());
        assertEquals("test", user.getUsername());
        assertEquals("pass", user.getPassword());
        assertEquals(2L, user.getRoleId());
    }
}