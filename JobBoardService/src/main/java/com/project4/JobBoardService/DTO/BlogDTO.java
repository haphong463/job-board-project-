package com.project4.JobBoardService.DTO;

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

    private String title;
    private String content;
    private String author;
    private Long blogCategoryId;

    private Boolean status;
    private String slug;
    private MultipartFile image;

    // Getters and setters
}
