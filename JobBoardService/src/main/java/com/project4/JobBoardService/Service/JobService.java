package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.Review;

import java.util.List;
import java.util.Optional;
import java.util.Optional;

public interface JobService {
    List<JobDTO> getAllJobs();
    List<JobDTO> getSuperHotJobs();
//    List<JobDTO> findAllJobsByCompanyId(Long userId);
//    List<JobDTO> searchJobsByCompanyId(Long userId, String query);
//    List<JobDTO> filterJobsByExpirationStatus(Long userId, boolean isExpired);
    boolean createJob(Long companyId, List<Long> categoryId, JobDTO jobDTO);
    JobDTO updateJob(Long jobId, JobDTO jobDTO);
    void deleteJob(Long jobId);
    Optional<JobDTO> findJobById(Long jobId);
}
