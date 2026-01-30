package com.iv1201.recruitment.model;

import jakarta.persistence.*;

@Entity
@Table(name = "competence")
public class Competence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "competence_id")
    private Long competenceId;

    @Column(name = "name")
    private String name;

    // --- GETTERS AND SETTERS ---
    
    public Long getCompetenceId() { // This was missing or named getId()
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
}