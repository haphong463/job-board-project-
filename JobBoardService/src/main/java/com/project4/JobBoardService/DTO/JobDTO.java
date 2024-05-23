package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobDTO {
    private Long id;
    private String title;
    private Integer offeredSalary;
    private String description;
    private String city;
    private String responsibilities;
    private String requiredSkills;
    private String workSchedule;
    private String keySkills;
    private String position;
    private String experience;
    private String qualification;
    private LocalDate createdAt;
    private Long categoryId;
    private Long companyId;

}
