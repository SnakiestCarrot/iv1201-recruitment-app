package com.iv1201.recruitment.dto;

import com.iv1201.recruitment.validation.ValidEmail;
import com.iv1201.recruitment.validation.ValidPnr;

/**
 * DTO for updating a user's profile information.
 * Used for migrated users completing missing data.
 */
public class UpdateProfileDTO {

    @ValidEmail
    private String email;

    @ValidPnr
    private String pnr;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPnr() {
        return pnr;
    }

    public void setPnr(String pnr) {
        this.pnr = pnr;
    }
}
