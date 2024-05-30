package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private BlogCategoryDTO category;
    private UserDTO user;
    // Getters and setters

    // Inner class for category DTO
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BlogCategoryDTO {
        private Long id;
        private String name;

        // Getters and setters
    }
}
