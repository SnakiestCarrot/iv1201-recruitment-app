package com.iv1201.recruitment.dto;

import com.iv1201.recruitment.validation.ValidStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object for updating the status of a recruitment application.
 *
 * The status must be one of: UNHANDLED, ACCEPTED, or REJECTED.
 */
public class StatusUpdateDTO {

    @NotBlank(message = "Status is required")
    @ValidStatus
    private String status;

    @NotNull(message = "Version is required")
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
