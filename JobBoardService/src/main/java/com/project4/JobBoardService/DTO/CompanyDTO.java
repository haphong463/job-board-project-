package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyDTO {

    private Long companyId;


    private String companyName;


    private String logo;


    private String websiteLink;


    private String description;




    private String location;
    private String type;

    private String keySkills;
    private String companySize;
    private String country;
    private String countryCode;
    private String workingDays;
    private List<ReviewDTO> reviews;  // List of ReviewDTO

    private List<JobApplicationDTO> jobApplications; // Chỉ bao gồm thông tin cần thiết
    private Boolean membershipRequired = false;
    public void setReviews(List<ReviewDTO> reviews) {
        this.reviews = reviews;
    }

    public void setJobs(List<JobDTO> jobDTOs) {

    }
}
