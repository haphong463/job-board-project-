package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Enum.BlogStatus;
import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private String title;
    @NotNull
    private String content;

    @NotNull
    private List<Long> categoryIds; // Danh sách id của các BlogCategory

    @NotNull
    private String citation;

    @NotNull
    public  String username;

    @NotNull
    private boolean visibility;

    @NotNull
    private String slug;
    @Nullable
    private MultipartFile image;

    // Getters and setters
}
