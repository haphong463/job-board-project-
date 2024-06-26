package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Service.QuestionService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.project4.JobBoardService.DTO.QuestionDTO;
import com.project4.JobBoardService.Entity.Question;
import com.project4.JobBoardService.Entity.Quiz;
import com.project4.JobBoardService.Repository.QuestionRepository;
import com.project4.JobBoardService.Repository.QuizRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

        @Autowired
        private QuestionRepository questionRepository;

        @Autowired
        private QuizRepository quizRepository;

        @Autowired
        private ModelMapper modelMapper;

        @Override
        public List<QuestionDTO> getAllQuestions() {
            return questionRepository.findAll().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }

        @Override
        public Optional<QuestionDTO> getQuestionById(Long id) {
            return questionRepository.findById(id)
                    .map(this::convertToDTO);
        }

        @Override
        public QuestionDTO createQuestion(Long quizId, QuestionDTO questionDTO) {
            Quiz quiz = quizRepository.findById(quizId)
                    .orElseThrow(() -> new RuntimeException("Quiz not found"));

            Question question = new Question();
            question.setQuestionText(questionDTO.getQuestionText());
            question.setOptions(questionDTO.getOptions());
            question.setCorrectAnswer(questionDTO.getCorrectAnswer());
            question.setQuiz(quiz);

            question = questionRepository.save(question);

            return convertToDTO(question);
        }

        @Override
        public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
            Optional<Question> optionalQuestion = questionRepository.findById(id);
            if (optionalQuestion.isPresent()) {
                Question question = optionalQuestion.get();
                question.setQuestionText(questionDTO.getQuestionText());
                question.setOptions(questionDTO.getOptions());
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                if (questionDTO.getQuizId() != null) {
                    Quiz quiz = quizRepository.findById(questionDTO.getQuizId())
                            .orElseThrow(() -> new RuntimeException("Quiz not found"));
                    question.setQuiz(quiz);
                }
                question = questionRepository.save(question);
                return convertToDTO(question);
            } else {
                throw new RuntimeException("Question not found");
            }
        }

        @Override
        public void deleteQuestion(Long id) {
            questionRepository.deleteById(id);
        }

        public QuestionDTO convertToDTO(Question question) {
            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setId(question.getId());
            questionDTO.setQuestionText(question.getQuestionText());
            questionDTO.setOptions(question.getOptions());
            questionDTO.setCorrectAnswer(question.getCorrectAnswer());
            questionDTO.setQuizId(question.getQuiz().getId());
            return questionDTO;
        }

        private Question convertToEntity(QuestionDTO questionDTO) {
            return modelMapper.map(questionDTO, Question.class);
        }
}
