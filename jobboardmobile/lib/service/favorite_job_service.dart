import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/favorite_job_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';

class FavoriteJobService {
  final String baseUrl = '${Endpoint.baseUrl}/favorite-jobs';
  final AuthService _authService = AuthService();

  Future<Map<String, dynamic>> addJobToFavorites(int jobId) async {
    final accessToken = await _authService.getAccessToken();
    final response = await http.post(
      Uri.parse('$baseUrl/add'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({'jobId': jobId}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to add job to favorites: ${response.body}');
    }
  }

  Future<List<FavoriteJob>> getFavoriteJobsForUser() async {
    final accessToken = await _authService.getAccessToken();
    final response = await http.get(
      Uri.parse('$baseUrl/list'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    if (response.statusCode == 200) {
      List<dynamic> jsonResponse = jsonDecode(response.body);
      return jsonResponse.map((data) => FavoriteJob.fromJson(data)).toList();
    } else {
      throw Exception('Failed to load favorite jobs: ${response.body}');
    }
  }

  Future<void> deleteFavoriteJob(int favoriteId) async {
    final accessToken = await _authService.getAccessToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/delete/$favoriteId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete favorite job: ${response.body}');
    }
  }
}
