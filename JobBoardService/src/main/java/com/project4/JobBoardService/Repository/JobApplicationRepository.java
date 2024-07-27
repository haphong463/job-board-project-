package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
}
