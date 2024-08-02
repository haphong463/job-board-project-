package com.project4.JobBoardService.Entity;

import com.project4.JobBoardService.DTO.JobDTO;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Lob
    @Column(name = "cv_file", columnDefinition = "LONGBLOB")
    private byte[] cvFile;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

}

