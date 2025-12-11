package com.Task.employeeAPI.notification;

import com.Task.employeeAPI.dto.NotificationDTO;
import com.Task.employeeAPI.exceptions.BadRequestException;
import com.Task.employeeAPI.services.concrete.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final EmailService emailService;

    // Fake method, called manually if needed
    public void process(NotificationDTO dto) {
        if (dto.getEmail() == null) {
            throw new BadRequestException("Email is null!");
        }

        // Direct call — no Kafka needed
        emailService.sendEmail(dto.getEmail(), dto.getSubject(), dto.getBody());
    }
}
