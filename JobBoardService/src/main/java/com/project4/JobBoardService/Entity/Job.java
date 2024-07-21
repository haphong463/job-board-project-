package com.project4.JobBoardService.Entity;

import com.project4.JobBoardService.Enum.*;
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

    @Enumerated(EnumType.STRING)
    private Position position;

    @Column(columnDefinition = "text")
    private String experience;

    @Column(columnDefinition = "text")
    private String qualification;

    @Column(name = "job_type")
    @Enumerated(EnumType.STRING)
    private JobType jobType;

    @Column(name = "contract_type")
    @Enumerated(EnumType.STRING)
    private ContractType contractType;

    @Column(columnDefinition = "text")
    private String benefit;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String expire;
    private Integer slot;

    @Builder.Default
    @Column(nullable = false, name = "profile_ approved")
    private Integer profileApproved = 0;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isSuperHot;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Column(name = "expired")
    private LocalDateTime expired;

    public Boolean getIsSuperHot() {
        return isSuperHot;
    }

    public void setIsSuperHot(Boolean isSuperHot) {
        this.isSuperHot = isSuperHot;
    }
}
