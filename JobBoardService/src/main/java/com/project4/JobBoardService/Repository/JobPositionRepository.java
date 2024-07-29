package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.JobPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
}