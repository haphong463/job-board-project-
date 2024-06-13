package com.project4.JobBoardService.DTO;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private String title;
    private String description;
    private double rating;
}
