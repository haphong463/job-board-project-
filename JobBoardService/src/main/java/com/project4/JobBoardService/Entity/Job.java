package com.project4.JobBoardService.Entity;

import com.project4.JobBoardService.Enum.Position;
import com.project4.JobBoardService.Enum.WorkSchedule;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
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
    private Integer offeredSalary;

    @Column(columnDefinition = "text")
    private String description;

    private String city;

    @Column(columnDefinition = "text")
    private String responsibilities;

    @Column(columnDefinition = "text")
    private String requiredSkills;

    @Column(name = "work_schedule")
    private String workSchedule;


    @Column(columnDefinition = "text")
    private String benefit;

    @Column(name = "keySkills")
    private String keySkills;

    private Position position;

    private String experience;

    private String qualification;

    private int slot;

    @Column(name = "created_at")
    private LocalDateTime createdAt;



    @ManyToMany
    @JoinTable(
            name = "job_category",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;


    @Builder.Default
    @Column(nullable = false, name = "profile_ approved")
    private Integer profileApproved = 0;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isSuperHot;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user", nullable = false)
    private User user;


    @Builder.Default
    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }


    @Column(name = "expired")
    private LocalDateTime expired;

    private String expire;

    public boolean isSuperHot() {
        return isSuperHot;
    }

    public void setSuperHot(boolean superHot) {
        isSuperHot = superHot;
    }
}
