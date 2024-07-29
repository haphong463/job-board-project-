package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private String offeredSalary;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String responsibilities;

    @Column(columnDefinition = "text")
    private String requiredSkills;

    @Column(name = "work_schedule", columnDefinition = "text")
    private String workSchedule;

    @Column(name = "keySkills")
    private String keySkills;



    @Column(columnDefinition = "text")
    private String experience;

    @Column(columnDefinition = "text")
    private String qualification;


    @ManyToMany
    @JoinColumn(name = "contract_type_id")
    private ContractType contractType;


    @Column(columnDefinition = "text")
    private String benefit;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private Integer slot;

    @Builder.Default
    @Column(nullable = false, name = "profile_ approved")
    private Integer profileApproved = 0;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isSuperHot;

    @ManyToMany
    @JoinTable(
            name = "job_category",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "job_job_type",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "job_type_id")
    )
    private Set<JobType> jobTypes = new HashSet<>();
    @ManyToOne
    @JoinColumn(name = "job_position_id")
    private JobPosition jobPosition;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private String expire;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Boolean getIsSuperHot() {
        return isSuperHot;
    }

    public void setIsSuperHot(Boolean isSuperHot) {
        this.isSuperHot = isSuperHot;
    }
}
