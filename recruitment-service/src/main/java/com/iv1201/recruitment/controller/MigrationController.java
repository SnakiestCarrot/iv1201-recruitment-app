package com.iv1201.recruitment.controller;

import com.iv1201.recruitment.dto.EmailRequestDTO;
import com.iv1201.recruitment.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/recruitment")
public class MigrationController {

    private final ApplicationService applicationService;

    public MigrationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Handles mirgated (old) user password reset request
     * Always returns a generic response for security reasons.
     */
    @PostMapping("/migrated-user")
    public ResponseEntity<String> handleMigratedUser(@Valid @RequestBody EmailRequestDTO request) {

        boolean exists = applicationService.emailExists(request.getEmail());

        if (exists) {
            System.out.println("==================================");
            System.out.println("[MOCK EMAIL SERVICE]");
            System.out.println("Password reset sent to: " + request.getEmail());
            System.out.println("Reset link: http://localhost:5173/reset?token=FAKE_TOKEN");
            System.out.println("==================================");
        }

        return ResponseEntity.ok(
                "If this email exists in our system, you will receive password reset instructions shortly."
        );
    }
    
}
