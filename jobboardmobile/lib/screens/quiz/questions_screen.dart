import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'dart:convert';
import 'dart:math';
import '../../models/questions_model.dart';
import '../../service/quiz_service.dart';

class QuizQuestionsPage extends StatefulWidget {
  final int quizId;
  final int userId;

  const QuizQuestionsPage({
    Key? key,
    required this.quizId,
    required this.userId,
  }) : super(key: key);

  @override
  _QuestionScreenState createState() => _QuestionScreenState();
}

class _QuestionScreenState extends State<QuizQuestionsPage> {
  late List<Question> questions = [];
  late Map<String, String> selectedAnswers = {};
  int currentQuestionIndex = 0;
  int timeLeft = 10 * 60;
  late Timer timer;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchQuizQuestions();
    startTimer();
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  void startTimer() {
    timer = Timer.periodic(Duration(seconds: 1), (Timer t) {
      setState(() {
        if (timeLeft < 1) {
          t.cancel();
          handleSubmitQuiz();
        } else {
          timeLeft--;
        }
      });
    });
  }

  Future<void> fetchQuizQuestions() async {
    final String sessionIdKey = 'sessionId_${widget.quizId}';
    final String questionsKey = 'questions_${widget.quizId}';
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    final sessionId = prefs.getString(sessionIdKey);
    final savedQuestions = prefs.getString(questionsKey);

    if (sessionId != null && savedQuestions != null) {
      setState(() {
        try {
          List<dynamic> decodedQuestions = json.decode(savedQuestions);
          List<Question> loadedQuestions = decodedQuestions
              .map((questionJson) => Question.fromJson(questionJson))
              .toList();

          // Shuffle the loaded questions and take the first 10
          loadedQuestions.shuffle(Random());
          questions = loadedQuestions.take(10).toList();
          isLoading = false;
        } catch (e) {
          print('Error decoding saved questions: $e');
        }
      });
    } else {
      final newSessionId = Uuid().v4();
      await prefs.setString(sessionIdKey, newSessionId);
      try {
        final fetchedQuestions = await QuizService.getQuizQuestions(
          widget.quizId.toString(),
          count: 50, // Fetch all 50 questions
        );

        // Shuffle the fetched questions and take the first 10
        fetchedQuestions.shuffle(Random());
        setState(() {
          questions = fetchedQuestions
              .map((questionJson) => Question.fromJson(questionJson))
              .toList()
              .take(10)
              .toList();
          isLoading = false;
        });

        await prefs.setString(questionsKey, json.encode(fetchedQuestions));
      } catch (e) {
        print('Failed to load quiz questions: $e');
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  void handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setState(() {
        currentQuestionIndex++;
      });
    }
  }

  void handlePrevQuestion() {
    if (currentQuestionIndex > 0) {
      setState(() {
        currentQuestionIndex--;
      });
    }
  }

  void handleAnswerSelect(String questionId, String answer) {
    setState(() {
      selectedAnswers[questionId] = answer;
    });
  }

  void handleSubmitQuiz() async {
    List<Map<String, dynamic>> submissionQuestions =
        selectedAnswers.keys.map((questionId) {
      String selectedAnswer = selectedAnswers[questionId]!;
      String correctAnswer = questions
          .firstWhere(
              (question) => question.id.toString() == questionId.toString())
          .correctAnswer;
      selectedAnswer = selectedAnswers[questionId]!.split(".")[0].trim();

      return {
        'questionId': int.parse(questionId),
        'selectedAnswer': selectedAnswer,
        'userAnswer': selectedAnswers[questionId],
      };
    }).toList();

    final submission = {
      'quizId': widget.quizId,
      'userId': widget.userId,
      'questions': submissionQuestions,
    };

    try {
      final dynamic response = await QuizService.submitQuiz(submission);

      if (response is Map<String, dynamic>) {
        final results = response['results'];
        final score = response['score'];

        Navigator.pushReplacementNamed(
          context,
          '/quiz/${widget.quizId}/result',
          arguments: {
            'results': results,
            'totalQuestions': questions.length,
            'score': score,
            'quizId': widget.quizId,
          },
        );
      } else {
        throw Exception('Invalid response from server');
      }
    } catch (error) {
      print('Error submitting quiz: $error');
    }
  }

  String formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '$minutes:${secs < 10 ? '0' : ''}$secs';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text(
          'Quiz Questions',
          style: TextStyle(color: Colors.black),
        ),
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: isLoading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : questions.isNotEmpty
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].questionText}',
                        style: TextStyle(
                          fontSize: 18.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Expanded(
                      child: ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        children: questions[currentQuestionIndex]
                            .getOptionsList()
                            .asMap()
                            .entries
                            .map((entry) {
                          String optionValue = entry.value;

                          return RadioListTile<String>(
                            value: optionValue,
                            groupValue: selectedAnswers[
                                questions[currentQuestionIndex].id.toString()],
                            onChanged: (value) {
                              handleAnswerSelect(
                                questions[currentQuestionIndex].id.toString(),
                                value!,
                              );
                            },
                            title: Text(optionValue),
                          );
                        }).toList(),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ElevatedButton(
                            onPressed: handlePrevQuestion,
                            child: Text('Previous'),
                          ),
                          ElevatedButton(
                            onPressed: handleNextQuestion,
                            child: Text('Next'),
                          ),
                          ElevatedButton(
                            onPressed: handleSubmitQuiz,
                            child: Text('Submit Quiz'),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Time Left: ${formatTime(timeLeft)}',
                        style: TextStyle(fontSize: 20.0),
                      ),
                    ),
                  ],
                )
              : Center(
                  child: Text('No questions available'),
                ),
    );
  }
}
