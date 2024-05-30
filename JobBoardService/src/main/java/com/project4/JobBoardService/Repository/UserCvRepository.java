package com.project4.JobBoardService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;



import com.project4.JobBoardService.Entity.UserCV;


public interface UserCvRepository extends JpaRepository<UserCV, Long> {

}
