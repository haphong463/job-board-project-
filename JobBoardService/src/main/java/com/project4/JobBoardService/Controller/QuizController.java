package com.project4.JobBoardService.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project4.JobBoardService.DTO.*;
import com.project4.JobBoardService.Entity.Question;
import com.project4.JobBoardService.Entity.Quiz;
import com.project4.JobBoardService.Entity.QuizScore;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.QuizRepository;
import com.project4.JobBoardService.Repository.QuizScoreRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.QuestionService;
import com.project4.JobBoardService.Service.QuizService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;



import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
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
    private QuestionService questionService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuizScoreRepository quizScoreRepository;
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
        try {
            List<Quiz> quizzes = quizService.getAllQuizzes();
            List<QuizDTO> quizDtos = quizzes.stream()
                    .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(quizDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
    ///
    @DeleteMapping("/{quizId}/questions")
    @Transactional
    public ResponseEntity<Void> deleteQuestionsByQuizId(@PathVariable Long quizId) {
        questionService.deleteQuestionsByQuizId(quizId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/questions")
    @Transactional
    public ResponseEntity<Void> deleteQuestionsByIds(@RequestBody List<Long> questionIds) {
        questionService.deleteQuestionsByIds(questionIds);
        return ResponseEntity.noContent().build();
    }



//        @PreAuthorize("permitAll()")
//        @PostMapping("/submit")
//        public ResponseEntity<QuizSubmissionResponseDTO> submitQuiz(@RequestBody QuizSubmissionDTO quizSubmission) {
//            List<QuestionResultDTO> results = quizService.calculateDetailedScore(quizSubmission);
//
//            int correctAnswersCount = (int) results.stream()
//                    .filter(result -> result.getSelectedAnswer().equals(result.getCorrectAnswer()))
//                    .count();
//            double totalQuestions = results.size();
//            double scorePerQuestion;
//
//
//            if (totalQuestions == 20) {
//                scorePerQuestion = 0.5;
//            } else if (totalQuestions == 15) {
//                scorePerQuestion = 0.67;
//            } else if (totalQuestions == 10) {
//                scorePerQuestion = 1.0;
//            } else {
//                scorePerQuestion = 1.0;
//            }
//
//            double score = totalQuestions > 0 ? scorePerQuestion * correctAnswersCount : 0;
//
//            User user = userRepository.findById(quizSubmission.getUserId())
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//            Quiz quiz = quizRepository.findById(quizSubmission.getQuizId())
//                    .orElseThrow(() -> new RuntimeException("Quiz not found"));
//
//            QuizScore quizScore = new QuizScore();
//            quizScore.setUser(user);
//            quizScore.setQuiz(quiz);
//            quizScore.setScore(score);
//            quizScoreRepository.save(quizScore);
//
//            QuizSubmissionResponseDTO responseDTO = new QuizSubmissionResponseDTO();
//            responseDTO.setResults(results);
//            responseDTO.setScore(score);
//
//            System.out.println("Response DTO: " + responseDTO);
//
//            return ResponseEntity.ok(responseDTO);
//        }




//    @PreAuthorize("hasRole('ADMIN')")
@GetMapping("/{quizId}/export")
public ResponseEntity<Resource> exportQuizToExcel(@PathVariable Long quizId ) {
    Quiz quiz = quizService.getQuizById(quizId);
    if (quiz == null) {
        return ResponseEntity.notFound().build();
    }

    List<Question> questions = quiz.getQuestions();

    try (Workbook workbook = new XSSFWorkbook()) {
        Sheet sheet = workbook.createSheet("Quiz");

        // Create header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Question Text");
        headerRow.createCell(1).setCellValue("Option A");
        headerRow.createCell(2).setCellValue("Option B");
        headerRow.createCell(3).setCellValue("Option C");
        headerRow.createCell(4).setCellValue("Option D");
        headerRow.createCell(5).setCellValue("Correct Answer");

        int rowNum = 1;
        for (Question question : questions) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(question.getQuestionText());

            String[] options = question.getOptions().split(", ");
            row.createCell(1).setCellValue(options.length > 0 ? options[0].substring(3) : "");
            row.createCell(2).setCellValue(options.length > 1 ? options[1].substring(3) : "");
            row.createCell(3).setCellValue(options.length > 2 ? options[2].substring(3) : "");
            row.createCell(4).setCellValue(options.length > 3 ? options[3].substring(3) : "");
            row.createCell(5).setCellValue(question.getCorrectAnswer());
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        byte[] bytes = outputStream.toByteArray();

        ByteArrayResource resource = new ByteArrayResource(bytes);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quiz_" + quizId + quiz.getTitle().replaceAll("\\s+", "_")  + ".xls" );
        headers.set(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(bytes.length)
                .body(resource);

    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}



//
@GetMapping("/{quizId}/attempts")
public ResponseEntity<QuizAttemptResponseDTO> getQuizAttempts(@PathVariable Long quizId, @RequestParam Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

    QuizScore quizScore = quizScoreRepository.findTopByUserAndQuizOrderByIdDesc(user, quiz);

    QuizAttemptResponseDTO responseDTO = new QuizAttemptResponseDTO();
    responseDTO.setAttemptsLeft(quizScore != null ? 3 - quizScore.getAttempts() : 3);

    if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isAfter(LocalDateTime.now())) {
        responseDTO.setLocked(true);
        responseDTO.setLockEndTime(quizScore.getLockEndTime());
        responseDTO.setTimeLeft(Duration.between(LocalDateTime.now(), quizScore.getLockEndTime()).getSeconds());
    } else {
        responseDTO.setLocked(false);
    }

    return ResponseEntity.ok(responseDTO);
}
//
@PreAuthorize("permitAll()")
@PostMapping("/submit")
public ResponseEntity<QuizSubmissionResponseDTO> submitQuiz(@RequestBody QuizSubmissionDTO quizSubmission) {
    User user = userRepository.findById(quizSubmission.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    Quiz quiz = quizRepository.findById(quizSubmission.getQuizId())
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

    // Fetch the latest QuizScore for this user and quiz
    QuizScore quizScore = quizScoreRepository.findTopByUserAndQuizOrderByIdDesc(user, quiz);

    // Check if the user is currently locked out
    if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isAfter(LocalDateTime.now())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }

    // Calculate the score
    List<QuestionResultDTO> results = quizService.calculateDetailedScore(quizSubmission);
    int correctAnswersCount = (int) results.stream()
            .filter(result -> result.getSelectedAnswer().equals(result.getCorrectAnswer()))
            .count();
    double totalQuestions = results.size();
    double scorePerQuestion;

    if (totalQuestions == 20) {
        scorePerQuestion = 0.5;
    } else if (totalQuestions == 15) {
        scorePerQuestion = 0.67;
    } else if (totalQuestions == 10) {
        scorePerQuestion = 1.0;
    } else {
        scorePerQuestion = 1.0;
    }

    double score = totalQuestions > 0 ? scorePerQuestion * correctAnswersCount : 0;

    // Save the score and update the attempts
    if (quizScore == null) {
        quizScore = new QuizScore();
        quizScore.setUser(user);
        quizScore.setQuiz(quiz);
        quizScore.setAttempts(0); // Initialize attempts if new quizScore
    }

    quizScore.setScore(score);
    quizScore.setAttempts(quizScore.getAttempts() + 1);

    System.out.println("User ID: " + user.getId());
    System.out.println("Quiz ID: " + quiz.getId());
    System.out.println("Attempts: " + quizScore.getAttempts());
    System.out.println("Score: " + score);

    // Check if the score is passing
    double passingScore = 7.0; // Define your passing score
    if (score < passingScore && quizScore.getAttempts() >= 3) {
        quizScore.setLocked(true);
        quizScore.setLockEndTime(LocalDateTime.now().plusDays(3));
    }

    quizScoreRepository.save(quizScore);

    // Prepare the response
    QuizSubmissionResponseDTO responseDTO = new QuizSubmissionResponseDTO();
    responseDTO.setResults(results);
    responseDTO.setScore(score);

    return ResponseEntity.ok(responseDTO);
}
}
