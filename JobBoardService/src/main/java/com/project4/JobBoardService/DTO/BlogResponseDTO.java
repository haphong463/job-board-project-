package com.project4.JobBoardService.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private BlogCategoryDTO category;
    private UserDTO user;
    private Boolean status;
    private String slug;

    // Getters and setters

    // Inner class for category DTO

}
