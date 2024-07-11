import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  // final String baseUrl = 'http://localhost:8080/api/auth';
  final String baseUrl = 'http://192.168.1.18:8080/api/auth';

  final storage = const FlutterSecureStorage();

  Future<http.Response> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signin'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      var jsonResponse = jsonDecode(response.body);
      await storage.write(key: 'accessToken', value: jsonResponse['jwt']);
      await storage.write(
          key: 'refreshToken', value: jsonResponse['refreshToken']);
    } else {
      throw Exception('Failed to login');
    }

    return response;
  }

  Future<http.Response> register(String username, String email, String password,
      String firstName, String lastName) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/signup'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
        }),
      );

      if (response.statusCode == 200) {
        return response;
      } else {
        throw Exception('Failed to register: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in register API: $e');
      throw Exception('Failed to register: $e');
    }
  }

  Future<http.Response> forgotPassword(String email) {
    return http.post(
      Uri.parse('$baseUrl/forgot-password?email=$email'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );
  }

  Future<String> setNewPassword(String email, String token, String newPassword,
      String confirmPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/set-new-password'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': email,
          'token': token,
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        }),
      );

      if (response.statusCode == 200) {
        return "Password reset successfully!";
      } else {
        return jsonDecode(response.body)['message'];
      }
    } catch (error) {
      return "Something went wrong. Please try again later.";
    }
  }

  Future<void> logout() async {
    await storage.delete(key: 'accessToken');
    await storage.delete(key: 'refreshToken');
  }

  Future<String?> getAccessToken() async {
    return await storage.read(key: 'accessToken');
  }

  Future<String?> getRefreshToken() async {
    return await storage.read(key: 'refreshToken');
  }
}
