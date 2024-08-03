import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/review_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';

class ReviewService {
  final String baseUrl = '${Endpoint.baseUrl}/companies';

  final String defaultImageUrl =
      'https://bootdey.com/img/Content/avatar/avatar6.png';

  Future<List<Review>> getAllReviews(int companyId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/$companyId/reviews'));

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        if (jsonResponse == null || jsonResponse is! List) {
          throw Exception('Invalid JSON format');
        }

        List<Review> reviews =
            jsonResponse.map((json) => Review.fromJson(json)).toList();
        return reviews;
      } else {
        throw Exception('Failed to load reviews');
      }
    } catch (e) {
      throw Exception('Failed to load reviews: $e');
    }
  }

  Future<Review> addReview(int companyId, Review review) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.post(
        Uri.parse('$baseUrl/$companyId/reviews'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
        body: jsonEncode(review.toJson()), // Sử dụng toJson()
      );

      if (response.statusCode == 200) {
        return Review.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to add review');
      }
    } catch (e) {
      throw Exception('Failed to add review: $e');
    }
  }

  Future<Review> updateReview(
      int companyId, int reviewId, Review review) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.put(
        Uri.parse('$baseUrl/$companyId/reviews/$reviewId'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
        body: jsonEncode(review.toJson()), // Sử dụng toJson()
      );

      if (response.statusCode == 200) {
        return Review.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to update review');
      }
    } catch (e) {
      throw Exception('Failed to update review: $e');
    }
  }

  Future<Review> getReview(int companyId, int reviewId) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.get(
        Uri.parse('$baseUrl/$companyId/reviews/$reviewId'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
      );

      if (response.statusCode == 200) {
        return Review.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to get review');
      }
    } catch (e) {
      throw Exception('Failed to get review: $e');
    }
  }

  Future<bool> hasUserReviewedCompany(int companyId) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();
      String? username = await authService.getUsername();

      if (username == null) {
        throw Exception('Username not found');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/$companyId/reviews/hasReviewed?username=$username'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as bool;
      } else {
        throw Exception('Failed to check if user has reviewed');
      }
    } catch (e) {
      throw Exception('Failed to check if user has reviewed: $e');
    }
  }
}
