package com.project4.JobBoardService.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;


public interface UserCvRepository extends JpaRepository<UserCV, Long> {
	UserCV findByUser(User user);
	 
	 @Query("SELECT u FROM UserCV u WHERE u.user.id = :userId AND u.template.id = :templateId")
	    Optional<UserCV> findByUserIdAndTemplateId(@Param("userId") Long userId, @Param("templateId") Long templateId);
//	 @EntityGraph(attributePaths = {"userDetails", "userEducations", "userExperiences", "userSkills", "userProjects", "userLanguages"})
	    UserCV findByUserId(Long userId);
}
