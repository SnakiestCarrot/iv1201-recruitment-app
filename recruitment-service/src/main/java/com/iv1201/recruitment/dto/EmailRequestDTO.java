package com.iv1201.recruitment.dto;

import com.iv1201.recruitment.validation.ValidEmail;
import jakarta.validation.constraints.NotBlank;

public class EmailRequestDTO {

    @NotBlank(message = "Email is required")
    @ValidEmail
    private String email;

    public EmailRequestDTO() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

