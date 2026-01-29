package com.iv1201.recruitment.service;

import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.model.Competence;
import com.iv1201.recruitment.model.CompetenceProfile;
import com.iv1201.recruitment.repository.CompetenceProfileRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompetenceServiceTest {

    @Mock
    private CompetenceProfileRepository competenceProfileRepository;

    @InjectMocks
    private CompetenceService competenceService;

    @Test
    void getAllCompetences_returnsMappedDTOs() {
        Competence competence = new Competence();
        competence.setId(1L);
        competence.setName("Java");

        CompetenceProfile competenceProfile = new CompetenceProfile();
        competenceProfile.setCompetence(competence);
        competenceProfile.setYearsOfExperience(new BigDecimal("5.0"));

        when(competenceProfileRepository.findAll())
                .thenReturn(List.of(competenceProfile));

        List<CompetenceDTO> result = competenceService.getAllCompetences();

        assertThat(result).hasSize(1);

        CompetenceDTO dto = result.get(0);
        assertThat(dto.getCompetenceId()).isEqualTo(1L);
        assertThat(dto.getYearsOfExperience())
                .isEqualByComparingTo("5.0");
    }
}

