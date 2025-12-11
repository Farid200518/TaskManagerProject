package com.Task.employeeAPI.notification;

import com.Task.employeeAPI.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationProducer {

    private final NotificationConsumer consumer;

    public void sendNotification(NotificationDTO notification) {
        consumer.process(notification);
    }
}
