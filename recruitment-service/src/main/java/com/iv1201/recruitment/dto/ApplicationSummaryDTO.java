package com.iv1201.recruitment.dto;

/**
 * Data Transfer Object representing a summary of a recruitment application.
 * 
 * Used when recruiters list applications. Contains only non-sensitive
 * information intended for presentation purposes.
 */

public class ApplicationSummaryDTO {

    private Long personID;
    private String fullName;
    private String status; // UNHANDLED / ACCEPTED / REJECTED

    public Long getPersonID() {
        return personID;
    }

    public void setPersonID(Long personID) {
        this.personID = personID;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullname) {
        this.fullName = fullname;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
