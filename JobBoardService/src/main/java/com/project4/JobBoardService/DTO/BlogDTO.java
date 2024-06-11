package com.project4.JobBoardService.DTO;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {
    private Long id;
    private String title;
    private String content;
    private Long blogCategoryId;
    private String username;
    private BlogCategoryDTO category;
    private Date publishedAt;
    private Boolean status;
    private String slug;
    @Nullable
    private MultipartFile image;

    // Getters and setters
}
