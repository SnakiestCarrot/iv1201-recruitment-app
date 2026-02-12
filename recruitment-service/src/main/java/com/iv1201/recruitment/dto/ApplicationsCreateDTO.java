package com.iv1201.recruitment.dto;

import java.util.List;

/**
 * Data Transfer Object used when an applicant submits a recruitment application.
 *
 * Contains personal information as well as lists of competences and
 * availability periods provided by the applicant.
 * Email and pnr are no longer included here as they are collected during registration.
 */
public class ApplicationsCreateDTO {

    private String name;
    private String surname;

    private List<CompetenceDTO> competences;
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
