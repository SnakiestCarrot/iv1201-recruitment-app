package com.iv1201.recruitment.dto;

/**
 * Data Transfer Object for creating a person record during registration.
 * Called by the auth service as part of the saga pattern.
 */
public class PersonCreateDTO {

    private Long personId;
    private String email;
    private String pnr;

    public Long getPersonId() {
        return personId;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

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
