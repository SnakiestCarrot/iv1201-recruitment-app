package com.iv1201.recruitment.repository;

import com.iv1201.recruitment.model.Role;

import com.iv1201.recruitment.repository.RoleRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void saveAndFindRole() {
        Role role = new Role();
        role.setName("APPLICANT");

        Role saved = roleRepository.save(role);

        assertThat(saved.getId()).isNotNull();

        Role found = roleRepository.findById(saved.getId()).orElseThrow();
        assertThat(found.getName()).isEqualTo("APPLICANT");
    }
}

