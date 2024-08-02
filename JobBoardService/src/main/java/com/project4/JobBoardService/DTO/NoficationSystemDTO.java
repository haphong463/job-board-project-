package com.project4.JobBoardService.DTO;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoficationSystemDTO {
    private Long id;
    private String title;
    private String message;
    private LocalDateTime createdAt;

}
