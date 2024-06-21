package com.project4.JobBoardService.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project4.JobBoardService.DTO.QuizDTO;
import com.project4.JobBoardService.DTO.QuizSubmissionDTO;
import com.project4.JobBoardService.Entity.Quiz;
import com.project4.JobBoardService.Service.QuizService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ModelMapper modelMapper;
    public QuizController(QuizService quizService, ModelMapper modelMapper) {
        this.quizService = quizService;
        this.modelMapper = modelMapper;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createQuiz")
    public ResponseEntity<QuizDTO> createQuiz(@RequestParam("title") String title,
                                              @RequestParam("description") String description,

                                              @RequestParam("imageFile") MultipartFile imageFile) throws IOException {
        QuizDTO quizDto = new QuizDTO();
        quizDto.setTitle(title);
        quizDto.setDescription(description);

        Quiz quiz = modelMapper.map(quizDto, Quiz.class);

        Quiz createdQuiz = quizService.createQuiz(quiz, imageFile);

        QuizDTO responseDto = modelMapper.map(createdQuiz, QuizDTO.class);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        List<QuizDTO> quizDtos = quizzes.stream()
                .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(quizDtos);
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        if (quiz != null) {
            return ResponseEntity.ok(modelMapper.map(quiz, QuizDTO.class));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long id,
                                              @RequestParam("quiz") String quizStr,
                                              @RequestParam("imageFile") MultipartFile imageFile) throws IOException {
        QuizDTO quizDto = new ObjectMapper().readValue(quizStr, QuizDTO.class);
        Quiz updatedQuiz = modelMapper.map(quizDto, Quiz.class);
        Quiz quiz = quizService.updateQuiz(id, updatedQuiz, imageFile);
        if (quiz != null) {
            return ResponseEntity.ok(modelMapper.map(quiz, QuizDTO.class));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/submit")
    public ResponseEntity<Integer> submitQuiz(@RequestBody QuizSubmissionDTO quizSubmission) {
        int score = quizService.calculateScore(quizSubmission);
        return ResponseEntity.ok(score);
    }
}