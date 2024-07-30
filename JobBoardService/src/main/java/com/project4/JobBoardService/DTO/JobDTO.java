package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
    private Integer slot;
    private Integer profileApproved = 0;
    private Boolean isSuperHot;
    private List<Long> categoryId = new ArrayList<>(); // Đảm bảo không phải null
    private Long companyId;
    private String expire;
}
