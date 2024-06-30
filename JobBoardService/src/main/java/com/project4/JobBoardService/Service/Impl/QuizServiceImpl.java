package com.project4.JobBoardService.Service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project4.JobBoardService.DTO.QuestionResultDTO;
import com.project4.JobBoardService.DTO.QuestionSubmissionDTO;
import com.project4.JobBoardService.DTO.QuizSubmissionDTO;
import com.project4.JobBoardService.Entity.Question;
import com.project4.JobBoardService.Entity.Quiz;
import com.project4.JobBoardService.Repository.QuestionRepository;
import com.project4.JobBoardService.Repository.QuizRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Service.QuizService;
import com.project4.JobBoardService.Util.FileUtils;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;


@Service
public class QuizServiceImpl implements QuizService {
    private static final Logger logger = Logger.getLogger(QuizServiceImpl.class.getName());
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired

    private ObjectMapper objectMapper;
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private QuizScoreRepository quizScoreRepository;
    @Override
    public Quiz createQuiz(Quiz quiz, MultipartFile imageFile) throws IOException {
        handleImageFile(quiz, imageFile, "create");
        return quizRepository.save(quiz);
    }

    @Override
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    @Override
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }

    @Override
    public Quiz updateQuiz(Long id, Quiz updatedQuiz, MultipartFile imageFile) throws IOException {
        Quiz existingQuiz = quizRepository.findById(id).orElse(null);
        if (existingQuiz != null) {
            updateQuizDetails(existingQuiz, updatedQuiz);
            handleImageFile(existingQuiz, imageFile, "update");
            return quizRepository.save(existingQuiz);
        } else {
            logger.warning("Quiz not found: " + id);
            return null;
        }
    }

    @Override
    public void deleteQuiz(Long id) {
        Quiz existingQuiz = quizRepository.findById(id).orElse(null);
        if (existingQuiz != null) {
            deleteImageFile(existingQuiz);
            quizRepository.deleteById(id);
        }
    }

    private void handleImageFile(Quiz quiz, MultipartFile imageFile, String operationType) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if ("update".equals(operationType)) {
                    deleteImageFile(quiz);
                }
                Path originalFilePath = FileUtils.saveFile(imageFile, "quiz");
                String originalImageUrl = FileUtils.convertToUrl(originalFilePath, "quiz");
                quiz.setImageUrl(originalImageUrl);
                logger.info("Original image " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + originalImageUrl);

                int thumbnailWidth = 1200;
                int thumbnailHeight = 800;
                Path thumbnailFilePath = FileUtils.saveResizedImage(imageFile, "quiz", thumbnailWidth, thumbnailHeight);
                String thumbnailImageUrl = FileUtils.convertToUrl(thumbnailFilePath, "quiz/thumbnail");
                quiz.setThumbnailUrl(thumbnailImageUrl);
                logger.info("Thumbnail " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + thumbnailImageUrl);
            } catch (IllegalArgumentException | IOException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }
    }

    private void deleteImageFile(Quiz quiz) {
        String imageUrl = quiz.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String[] urlParts = imageUrl.split("/uploads/");
            if (urlParts.length == 2) {
                String[] pathParts = urlParts[1].split("/");
                String folder = pathParts[0];
                String fileName = pathParts[1];
                boolean fileDeleted = FileUtils.deleteFile(folder, fileName);
                if (!fileDeleted) {
                    logger.warning("Failed to delete the image file: " + fileName);
                }
            }
        }
    }

    private void updateQuizDetails(Quiz existingQuiz, Quiz updatedQuiz) {
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setDescription(updatedQuiz.getDescription());

        existingQuiz.setQuestions(updatedQuiz.getQuestions());
    }


    @Override
    public int calculateScore(QuizSubmissionDTO quizSubmission) {
        int score = 0;

        for (QuestionSubmissionDTO questionSubmission : quizSubmission.getQuestions()) {
            Question question = questionRepository.findById(questionSubmission.getQuestionId()).orElse(null);
            if (question != null && question.getCorrectAnswer().trim().equals(questionSubmission.getSelectedAnswer().trim())) {
                score++;
            }
        }

        return score;
    }
  @Override
    public List<QuestionResultDTO> calculateDetailedScore(QuizSubmissionDTO quizSubmission) {
        List<QuestionResultDTO> results = new ArrayList<>();
        Map<Long, String> correctAnswers = getCorrectAnswersForQuiz(quizSubmission.getQuizId());

        Long userId = quizSubmission.getUserId(); // Ensure userId is retrieved correctly

        for (QuestionSubmissionDTO questionSubmission : quizSubmission.getQuestions()) {
            String correctAnswer = correctAnswers.get(questionSubmission.getQuestionId());
            results.add(new QuestionResultDTO(
                    questionSubmission.getQuestionId(),
                    questionSubmission.getSelectedAnswer(),
                    correctAnswer,
                    userId 
            ));
        }

        return results;
    }


    private Map<Long, String> getCorrectAnswersForQuiz(Long quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        return questions.stream().collect(Collectors.toMap(Question::getId, Question::getCorrectAnswer));
    }




}
