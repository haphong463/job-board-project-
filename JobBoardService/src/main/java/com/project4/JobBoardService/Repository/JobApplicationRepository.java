package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserId(Long userId);


    boolean existsByUserIdAndJobId(Long userId, Long jobId);


}
