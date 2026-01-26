package com.iv1201.recruitment.dto;

/**
 * Data Transfer Object representing a competence included
 * in a recruitment application.
 */

import java.math.BigDecimal;

public class CompetenceDTO {

    private Long competenceId;
    private BigDecimal yearsOfExperience;

    public Long getCompetenceId() {
        return competenceId;
    }

    public void setCompetenceId(Long competenceId) {
        this.competenceId = competenceId;
    }

    public BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(BigDecimal yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}
