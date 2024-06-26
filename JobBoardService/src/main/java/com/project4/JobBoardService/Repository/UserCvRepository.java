package com.project4.JobBoardService.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;


public interface UserCvRepository extends JpaRepository<UserCV, Long> {
	 List<UserCV> findByUser(User user);
}
