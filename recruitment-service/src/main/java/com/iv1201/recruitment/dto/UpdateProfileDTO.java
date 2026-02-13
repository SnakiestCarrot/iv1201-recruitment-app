package com.iv1201.recruitment.dto;

/**
 * DTO for updating a user's profile information.
 * Used for migrated users completing missing data.
 */

public class UpdateProfileDTO {
    
    private String email;
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
