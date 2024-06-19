package com.project4.JobBoardService.DTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDTO {
    private Long id;
    private UserDTO sender;
    private UserDTO recipient;
    private String message;
}
