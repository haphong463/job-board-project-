import 'package:flutter/material.dart';

class QuizResultPage extends StatelessWidget {
  final Map<String, dynamic> arguments;

  QuizResultPage({required this.arguments});

  @override
  Widget build(BuildContext context) {
    final results = arguments['results'] as List<dynamic>;
    final totalQuestions = arguments['totalQuestions'] as int;
    final score = arguments['score'] is int
        ? (arguments['score'] as int).toDouble()
        : arguments['score'] as double;
    final quizId = arguments['quizId'] as int;

    return Scaffold(
      appBar: AppBar(
        title: Text('Quiz Result'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quiz ID: $quizId',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Text(
              'Total Questions: $totalQuestions',
              style: TextStyle(fontSize: 16),
            ),
            Text(
              'Score: $score',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: results.length,
                itemBuilder: (context, index) {
                  final result = results[index];
                  final question = result['question'];
                  final userAnswer = result['userAnswer'];
                  final correctAnswer = result['correctAnswer'];
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
