package com.iv1201.recruitment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CompetenceDTO {

    @NotNull(message = "Competence ID is required")
    private Long competenceId;

    private String name;

    @NotNull(message = "Years of experience is required")
    @DecimalMin(value = "0.0", message = "Years of experience cannot be negative")
    private BigDecimal yearsOfExperience;

    public Long getCompetenceId() {
        return competenceId;
    }

    public void setCompetenceId(Long competenceId) {
        this.competenceId = competenceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(BigDecimal yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}