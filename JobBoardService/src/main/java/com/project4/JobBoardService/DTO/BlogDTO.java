package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Enum.BlogStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Nullable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {
    private Long id;
    private String title;
    private String content;
    private List<Long> categoryIds; // Danh sách id của các BlogCategory
    private String citation;
    public  String username;
    private Date publishedAt;
    @Enumerated(EnumType.STRING)
    private BlogStatus status;
    private String slug;
    @Nullable
    private MultipartFile image;

    // Getters and setters
}
