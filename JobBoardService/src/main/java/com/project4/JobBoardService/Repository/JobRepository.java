package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompany_CompanyId(Long companyId);


}
