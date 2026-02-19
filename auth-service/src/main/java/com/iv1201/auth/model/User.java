package com.iv1201.auth.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

/**
 * Represents a user in the Authentication Database.
 * Implements Spring Security's UserDetails for authentication.
 */
@Entity
@Table(name = "person")
public class User implements UserDetails {

    /**
     * The unique identifier for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Long id;

    /**
     * The unique username used for logging in.
     */
    @Column(name = "username")
    private String username;

    /**
     * The encrypted password.
     */
    @Column(name = "password")
    private String password;

    /**
     * The identifier for the user's role (e.g., Applicant or Recruiter).
     */
    @Column(name = "role_id")
    private Long roleId;

    /**
     * Gets the unique person ID.
     * @return The primary key.
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique person ID.
     * @param id The primary key.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the username.
     * @return The username.
     */
    @Override
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username.
     * @param username The desired username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the hashed password.
     * @return The encrypted password string.
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password.
     * @param password The encrypted password hash.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the role ID.
     * @return The foreign key to the role table.
     */
    public Long getRoleId() {
        return roleId;
    }

    /**
     * Sets the role ID.
     * @param roleId The foreign key to the role table.
     */
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    /** {@inheritDoc} */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    /** {@inheritDoc} */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isEnabled() {
        return true;
    }
}