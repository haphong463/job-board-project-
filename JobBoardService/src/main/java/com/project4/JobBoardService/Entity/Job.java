package com.project4.JobBoardService.Entity;

import com.project4.JobBoardService.Enum.WorkSchedule;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "job")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "offered_salary")
    private Integer offeredSalary;

    @Column(columnDefinition = "text")
    private String description;

    private String city;

    @Column(columnDefinition = "text")
    private String responsibilities;

    @Column(columnDefinition = "text")
    private String requiredSkills;

    @Column(name = "work_schedule")
    @Enumerated(EnumType.STRING)
    private WorkSchedule workSchedule;

    @Column(name = "keySkills")
    private String keySkills;

    private String position;

    private String experience;

    private String qualification;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
