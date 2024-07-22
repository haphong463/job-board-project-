package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
}
