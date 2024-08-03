package com.project4.JobBoardService.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Rating is required")
    @Min(value = 0, message = "Rating must be greater than or equal to 0")
    @Max(value = 5, message = "Rating must be less than or equal to 5")
    private double rating;

    @NotBlank(message = "Username is required") // Add this validation
    private String username; // Add this field
    private String imageUrl;
    private int likeCount;
    private boolean likedByCurrentUser;

}
