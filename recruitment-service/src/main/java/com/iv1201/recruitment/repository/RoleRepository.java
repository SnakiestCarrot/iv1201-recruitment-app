package com.iv1201.recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iv1201.recruitment.model.Role;

/**
 * Repository for accessing Role entities from the database.
 */
public interface RoleRepository extends JpaRepository<Role, Long> {
}

