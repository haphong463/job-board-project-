package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
