package com.iv1201.recruitment.dto;

import java.util.List;

import com.iv1201.recruitment.validation.ValidName;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Data Transfer Object used when an applicant submits a recruitment application.
 *
 * Contains personal information as well as lists of competences and
 * availability periods provided by the applicant.
 * Email and pnr are no longer included here as they are collected during registration.
 */
public class ApplicationsCreateDTO {

    @NotBlank(message = "Name is required")
    @ValidName(message = "Name must contain only letters, spaces, and hyphens")
    private String name;

    @NotBlank(message = "Surname is required")
    @ValidName(message = "Surname must contain only letters, spaces, and hyphens")
    private String surname;

    @Valid
    private List<CompetenceDTO> competences;

    @NotNull(message = "Availabilities are required")
    @Valid
    private List<AvailabilityDTO> availabilities;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public List<CompetenceDTO> getCompetences() {
        return competences;
    }

    public void setCompetences(List<CompetenceDTO> competences) {
        this.competences = competences;
    }

    public List<AvailabilityDTO> getAvailabilities() {
        return availabilities;
    }

    public void setAvailabilities(List<AvailabilityDTO> availabilities) {
        this.availabilities = availabilities;
    }
}
