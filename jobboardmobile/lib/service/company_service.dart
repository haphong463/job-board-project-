import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/review_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';

class CompanyService {
  final String baseUrl = '${Endpoint.baseUrl}/companies';
  final AuthService _authService = AuthService();

  Future<Company?> getCompanyById(int id) async {
    final url = Uri.parse('$baseUrl/$id');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Company.fromJson(data);
    } else {
      throw Exception('Failed to load blogs');
    }
  }

  Future<List<Review>> getAllReviews(int companyId) async {
    try {
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.get(
        Uri.parse('$baseUrl/$companyId/reviews'),
        headers: {'Authorization': 'Bearer $accessToken'},
      );
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Review.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load reviews');
      }
    } catch (e) {
      throw Exception('Failed to fetch reviews: $e');
    }
  }

  Future<String> addReview(int companyId, Review review) async {
    try {
      final url = Uri.parse('$baseUrl/$companyId/reviews');
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(review.toJson()),
      );

      if (response.statusCode == 200) {
        return 'Review added successfully!';
      } else {
        return 'Failed to add review. Company or user not found.';
      }
    } catch (e) {
      throw Exception('Failed to save review: $e');
    }
  }

  Future<bool> hasUserReviewedCompany(int companyId) async {
    try {
      final url = Uri.parse('$baseUrl/$companyId/reviews/hasReviewed');
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http
          .get(url, headers: {'Authorization': 'Bearer $accessToken'});

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to check review status');
      }
    } catch (e) {
      throw Exception('Failed to check user reviewed: $e');
    }
  }
}
