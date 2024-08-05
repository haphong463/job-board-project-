package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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
//    private String[] keySkills;
    private String position;
    private String experience;
    private String qualification;
    private String benefit;
    private int slot;

    private Boolean isHidden;
    private LocalDateTime createdAt;
    private LocalDateTime expired;
    private String expire;
    private Integer profileApproved = 0;
    private Boolean isSuperHot;
    private List<Long> categoryIds;
    private Long companyId;
    private Long userId;

}
