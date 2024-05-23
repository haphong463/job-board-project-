package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Job;

import java.util.List;

public interface JobService {
    List<JobDTO> findAllJobsByCompanyId(Long companyId);
//    Integer countJobsByCompanyId(Long companyId);

    boolean createJob(Long companyId, Long categoryId, JobDTO jobDTO);
    JobDTO updateJob(Long jobId, JobDTO jobDTO);
    void deleteJob(Long jobId);
    List<JobDTO> findAllJobs(Long companyId);
}
