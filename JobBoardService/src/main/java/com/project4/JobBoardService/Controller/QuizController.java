package com.project4.JobBoardService.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project4.JobBoardService.DTO.QuestionResultDTO;
import com.project4.JobBoardService.DTO.QuizDTO;
import com.project4.JobBoardService.DTO.QuizSubmissionDTO;
import com.project4.JobBoardService.DTO.QuizSubmissionResponseDTO;
import com.project4.JobBoardService.Entity.Question;
import com.project4.JobBoardService.Entity.Quiz;
import com.project4.JobBoardService.Entity.QuizScore;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.QuizRepository;
import com.project4.JobBoardService.Repository.QuizScoreRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.QuizService;
import jakarta.servlet.http.HttpServletResponse;
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

        @PreAuthorize("permitAll()")
        @PostMapping("/submit")
        public ResponseEntity<QuizSubmissionResponseDTO> submitQuiz(@RequestBody QuizSubmissionDTO quizSubmission) {
            List<QuestionResultDTO> results = quizService.calculateDetailedScore(quizSubmission);

            int correctAnswersCount = (int) results.stream()
                    .filter(result -> result.getSelectedAnswer().equals(result.getCorrectAnswer()))
                    .count();
            double totalQuestions = results.size();
            double score = totalQuestions > 0 ? ((double) correctAnswersCount / totalQuestions) * 10 : 0;

            User user = userRepository.findById(quizSubmission.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Quiz quiz = quizRepository.findById(quizSubmission.getQuizId())
                    .orElseThrow(() -> new RuntimeException("Quiz not found"));

            QuizScore quizScore = new QuizScore();
            quizScore.setUser(user);
            quizScore.setQuiz(quiz);
            quizScore.setScore(score);
            quizScoreRepository.save(quizScore);

            QuizSubmissionResponseDTO responseDTO = new QuizSubmissionResponseDTO();
            responseDTO.setResults(results);
            responseDTO.setScore(score);

            System.out.println("Response DTO: " + responseDTO);

            return ResponseEntity.ok(responseDTO);
        }




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
}
