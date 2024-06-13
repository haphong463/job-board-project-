package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Enum.BlogStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String content;
    private BlogCategoryDTO category;
    private UserDTO user;
    @Enumerated(EnumType.STRING)
    private BlogStatus status;
    private String slug;
    private String imageUrl;
    private String thumbnailUrl;
    private Date createdAt;
    private Date updatedAt;
    private int commentCount;
    // Getters and setters

    // Inner class for category DTO

}
