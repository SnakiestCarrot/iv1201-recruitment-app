package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.CompetenceDTO;
import com.iv1201.recruitment.service.CompetenceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CompetenceController.class)
class CompetenceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CompetenceService competenceService;

    @Test
    void getAllCompetences_returnsOkAndJson() throws Exception {
        CompetenceDTO dto = new CompetenceDTO();
        dto.setCompetenceId(1L);
        dto.setYearsOfExperience(new BigDecimal("5.0"));

        when(competenceService.getAllCompetences())
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/recruitment/competences"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$[0].competenceId").value(1))
                .andExpect(jsonPath("$[0].yearsOfExperience").value(5.0));
    }
}
