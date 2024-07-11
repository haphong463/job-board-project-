import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import 'auth_service.dart';

class QuizService {
  final String baseUrl = 'http://192.168.110.22:8080/api/quizzes';
  final AuthService _authService = AuthService();
  final storage = FlutterSecureStorage();

  Future<List<Quiz>> getAllQuizzes() async {
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Quiz.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load quizzes');
    }
  }

  Future<Map<String, dynamic>> getAttemptsInfo(int quizId) async {
    final accessToken = await _authService.getAccessToken();
    final userId = await _authService
        .getUserId(); // Assuming you have a method to get user ID

    if (accessToken == null) {
      throw Exception('Access token is null');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/$quizId/attempts?userId=$userId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch attempts info');
    }
  }
}

class Quiz {
  final int id; // Changed to int
  final String title;
  final String description;
  final String imageUrl;
  final String thumbnailUrl; // Added thumbnailUrl field
  final int numberOfUsers; // Changed to int
  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.thumbnailUrl,
    required this.numberOfUsers, // Added thumbnailUrl field
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    return Quiz(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        imageUrl: json['imageUrl'],
        thumbnailUrl: json['thumbnailUrl'],
        numberOfUsers: json['numberOfUsers'] // Added thumbnailUrl field
        );
  }
}
