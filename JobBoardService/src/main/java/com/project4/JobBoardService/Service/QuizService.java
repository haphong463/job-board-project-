package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.QuizSubmissionDTO;
import com.project4.JobBoardService.Entity.Quiz;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface QuizService {
    Quiz createQuiz(Quiz quiz, MultipartFile imageFile) throws IOException;
    List<Quiz> getAllQuizzes();
    Quiz getQuizById(Long id);
    Quiz updateQuiz(Long id, Quiz updatedQuiz, MultipartFile imageFile)  throws IOException;
    void deleteQuiz(Long id);
    int calculateScore(QuizSubmissionDTO quizSubmission);


}