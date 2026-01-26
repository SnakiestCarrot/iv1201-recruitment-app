package com.iv1201.recruitment.dto;

import java.util.List;

/**
 * Data Transfer Object used when an applicant submits a recruitment application.
 * 
 * Contains personal information as well as lists of competences and
 * availability periods provided by the applicant. 
 */

public class ApplicationsCreateDTO {

    private String name;
    private String surname;
    private String email;
    private String pnr;

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
