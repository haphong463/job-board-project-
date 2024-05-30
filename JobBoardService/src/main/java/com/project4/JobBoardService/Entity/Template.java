package com.project4.JobBoardService.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Templates")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId;
    
    @Column(name = "name", unique = true, nullable = false)
    private String templateName;
    private String templateDescription;
    private String templateFilePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and setters
}

