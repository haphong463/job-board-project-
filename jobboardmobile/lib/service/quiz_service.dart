import 'dart:convert';
import 'package:http/http.dart' as http;

import 'auth_service.dart';

class QuizService {
  final String baseUrl = 'http://192.168.110.21:8080/api';
  final AuthService _authService = AuthService();

  Future<List<Quiz>> getAllQuizzes() async {
    final response = await http.get(Uri.parse('$baseUrl/quizzes'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((item) => Quiz.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load quizzes');
    }
  }

  Future<Map<String, dynamic>> getAttemptsInfo(int quizId, int userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/quizzes/$quizId/attempts?userId=$userId'),
    );
    if (response.statusCode == 200) {
      Map<String, dynamic> data = json.decode(response.body);
      print('getAttemptsInfo response: $data');
      return data;
    } else {
      print('Failed to load attempts info: ${response.statusCode}');
      throw Exception('Failed to load attempts info');
    }
  }

  Future<void> completeQuiz(int quizId, int userId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/quizzes/$quizId/complete'),
      body: json.encode({'userId': userId}),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to complete quiz');
    }
  }
}

class Quiz {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final int numberOfUsers;

  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.numberOfUsers,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    return Quiz(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      numberOfUsers: json['numberOfUsers'],
    );
  }
}

class AttemptsInfo {
  final int attemptsLeft;
  final bool locked;
  final int timeLeft;

  AttemptsInfo({
    required this.attemptsLeft,
    required this.locked,
    required this.timeLeft,
  });

  factory AttemptsInfo.fromJson(Map<String, dynamic> json) {
    return AttemptsInfo(
      attemptsLeft: json['attemptsLeft'],
      locked: json['locked'],
      timeLeft: json['timeLeft'],
    );
  }
}

class CompletedQuizzes {
  final List<int> completedQuizzes;

  CompletedQuizzes({
    required this.completedQuizzes,
  });

  factory CompletedQuizzes.fromJson(List<dynamic> json) {
    return CompletedQuizzes(
      completedQuizzes: List<int>.from(json.map((x) => x)),
    );
  }
}
