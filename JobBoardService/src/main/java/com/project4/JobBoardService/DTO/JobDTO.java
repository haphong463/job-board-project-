package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobDTO {
    private Long id;
    private String title;
    private String offeredSalary;
    private String description;
    private String responsibilities;
    private String requiredSkills;
    private String workSchedule;
    private String keySkills;
    private String position;
    private String experience;
    private String qualification;
    private String jobType;
    private String contractType;
    private String benefit;
    private LocalDateTime createdAt;
    private String expire;
    private Integer slot;
    private Integer profileApproved = 0;
    private Boolean isSuperHot;
    private Long categoryId;
    private Long companyId;
    private Long userId;
    private LocalDateTime expired;
}
