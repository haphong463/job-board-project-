package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Enum.BlogStatus;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    private String citation;
    private Date publishedAt;
    @Enumerated(EnumType.STRING)
    private BlogStatus status;
    private String slug;
    @Nullable
    private MultipartFile image;


    // Getters and setters
}
