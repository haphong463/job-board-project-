package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.QuizScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizScoreRepository extends JpaRepository<QuizScore, Long> {
    Optional<QuizScore> findByQuizIdAndUserId(Long quizId, Long userId);

}