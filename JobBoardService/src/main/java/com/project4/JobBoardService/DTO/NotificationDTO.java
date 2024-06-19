package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDTO {
    private Long id;
    private UserDTO sender;
    private UserDTO recipient;
    private String message;
    private boolean isRead;
}
