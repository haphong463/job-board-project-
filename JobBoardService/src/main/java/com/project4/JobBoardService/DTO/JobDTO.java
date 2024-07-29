package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private Set<JobTypeDTO> jobTypes; // Assuming you want to include jobTypes
    private ContractTypeDTO contractType; // Assuming you want to include contractType
    private JobPositionDTO jobPosition; // Assuming you want to include jobPosition

    private String benefit;
    private LocalDateTime createdAt;
    private Integer slot;
    private Integer profileApproved = 0;
    private Boolean isSuperHot;
    private List<Long> categoryId;
    private Long companyId;
    private String expire;
}
