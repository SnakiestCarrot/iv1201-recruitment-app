package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.model.Competence;
import com.iv1201.recruitment.repository.CompetenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class CompetenceServiceTest {

    @Mock
    private CompetenceRepository competenceRepository;

    @InjectMocks
    private CompetenceService competenceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCompetences() {
        Competence competence = new Competence();
        competence.setCompetenceId(1L);
        competence.setName("Java");

        when(competenceRepository.findAll()).thenReturn(Arrays.asList(competence));

        List<CompetenceDTO> result = competenceService.getAllCompetences();

        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).getName());
    }
}