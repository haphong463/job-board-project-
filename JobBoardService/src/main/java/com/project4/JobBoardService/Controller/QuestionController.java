package com.project4.JobBoardService.Controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.project4.JobBoardService.DTO.QuestionDTO;
import com.project4.JobBoardService.Service.QuestionService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/quizzes")
public class QuestionController {

    @Autowired
    private QuestionService questionService;
    @PreAuthorize("permitAll()")
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestionsByQuizId(@PathVariable Long quizId) {
        List<QuestionDTO> questions = questionService.getAllQuestions()
                .stream()
                .filter(question -> question.getQuizId().equals(quizId))
                .collect(Collectors.toList());
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long quizId, @PathVariable Long questionId) {
        Optional<QuestionDTO> question = questionService.getQuestionById(questionId);
        return question.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{quizId}/questions")
    public ResponseEntity<QuestionDTO> createQuestion(
            @PathVariable Long quizId,
            @RequestParam String questionText,
            @RequestParam String options,
            @RequestParam String correctAnswer) {

        // Create a new QuestionDTO instance
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setQuizId(quizId);
        questionDTO.setQuestionText(questionText);
        questionDTO.setOptions(options);
        questionDTO.setCorrectAnswer(correctAnswer);
        // Assuming you have a service method to save the question
        QuestionDTO createdQuestion = questionService.createQuestion(quizId, questionDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long quizId, @PathVariable Long questionId, @RequestBody QuestionDTO questionDTO) {
        QuestionDTO updatedQuestion = questionService.updateQuestion(questionId, questionDTO);
        return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long quizId, @PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}