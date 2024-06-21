package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}