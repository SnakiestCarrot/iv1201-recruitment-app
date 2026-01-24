package com.iv1201.auth.integration;

import com.iv1201.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for accessing the 'person' table in the database.
 * <p>
 * This interface is part of the <b>Integration Layer</b>. It abstracts away
 * the complexities of raw SQL queries. By extending {@link JpaRepository},
 * Spring Data automatically generates the implementation for us at runtime.
 * </p>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user in the database by their username.
     * <p>
     * This is the primary method used during the login process to retrieve
     * the user's credentials (password hash and role).
     * </p>
     *
     * @param username The username to search for.
     * @return An {@link Optional} containing the User if found, or empty if not.
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a specific username already exists in the database.
     * <p>
     * This is used during the registration process to ensure uniqueness
     * before attempting to create a new account.
     * </p>
     *
     * @param username The username to check.
     * @return <code>true</code> if the username is already taken; <code>false</code> otherwise.
     */
    boolean existsByUsername(String username);
}