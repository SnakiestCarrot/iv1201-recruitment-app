package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.UpdateProfileDTO;
import com.iv1201.recruitment.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/recruitment/profile")
public class ProfileController {

    private final ApplicationService applicationService;

    public ProfileController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Updates the authenticated user's profile information.
     * 
     * Requires X-User-ID header forwarded by the Gateway to identify the user.
     */
    @PutMapping
    public ResponseEntity<Void> updateProfile(
            @Valid @RequestBody UpdateProfileDTO dto,
            @RequestHeader(value = "X-User-ID", required = false) Long userId) {

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID header missing");
        }

        applicationService.updateUserProfile(userId, dto);
        return ResponseEntity.ok().build();
    }
}
