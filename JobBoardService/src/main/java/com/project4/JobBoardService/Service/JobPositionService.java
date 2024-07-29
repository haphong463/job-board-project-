package com.project4.JobBoardService.Service;


import com.project4.JobBoardService.DTO.JobPositionDTO;

import java.util.List;

public interface JobPositionService {

    JobPositionDTO getJobPositionById(Long id);

    List<JobPositionDTO> getAllJobPositions();

    JobPositionDTO createJobPosition(JobPositionDTO jobPositionDTO);

    JobPositionDTO updateJobPosition(Long id, JobPositionDTO jobPositionDTO);

    void deleteJobPosition(Long id);
}