package com.project4.JobBoardService.DTO;

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
    private Boolean status;
    private String slug;
    private String imageUrl;
    private Date createdAt;
    private Date updatedAt;

    // Getters and setters

    // Inner class for category DTO

}
