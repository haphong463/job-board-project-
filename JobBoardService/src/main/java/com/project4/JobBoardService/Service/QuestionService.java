package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.QuestionDTO;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    List<QuestionDTO> getAllQuestions();
    Optional<QuestionDTO> getQuestionById(Long id);
    QuestionDTO createQuestion(Long quizId,QuestionDTO questionDTO);
    QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO);
    void deleteQuestion(Long id);
}