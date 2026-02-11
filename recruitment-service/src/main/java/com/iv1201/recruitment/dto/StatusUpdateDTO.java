package com.iv1201.recruitment.dto;

/**
 * Data Transfer Object for updating the status of a recruitment application.
 *
 * The status must be one of: UNHANDLED, ACCEPTED, or REJECTED.
 */
public class StatusUpdateDTO {

    private String status;
    private Long version;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
