import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  // final String baseUrl = 'http://localhost:8080/api/auth';
  final String baseUrl = 'http://192.168.110.22:8080/api/auth';
  final storage = FlutterSecureStorage();

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
      await storage.write(key: 'firstName', value: jsonResponse['firstName']);
      await storage.write(key: 'lastName', value: jsonResponse['lastName']);
      await storage.write(key: 'email', value: jsonResponse['email']);
    } else {
      throw Exception('Failed to login');
    }

    return response;
  }

  Future<http.Response> register(String username, String email, String password,
      String firstName, String lastName) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/signupFlutter'),
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

  Future<void> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/forgot-password-flutter?email=$email'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode == 200) {
        print('Password reset email sent successfully.');
      } else if (response.statusCode == 400) {
        print('Invalid token or bad request: ${response.body}');
        throw Exception('Invalid token or bad request');
      } else {
        throw Exception(
            'Failed to send forgot password request: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Failed to send forgot password request: $error');
    }
  }

  Future<String> setNewPassword(
      String email, String newPassword, String confirmPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/set-new-passwordFlutter'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': email,
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        }),
      );

      if (response.statusCode == 200) {
        return "Password reset successfully!";
      } else {
        Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        return jsonResponse['message'];
      }
    } catch (error) {
      print('Error setting new password: $error');
      return "Something went wrong. Please try again later.";
    }
  }

  Future<http.Response> verifyEmail(String email, String code) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verifyFlutter?email=$email&code=$code'),
        headers: {'Content-Type': 'application/json'},
      );
      return response;
    } catch (e) {
      print('Error verifying email: $e');
      throw Exception('Failed to verify email: $e');
    }
  }

  Future<Map<String, dynamic>> verifyResetPassWord(
      String email, String code) async {
    try {
      final response = await http.post(
        Uri.parse(
            '$baseUrl/verifyResetPassWordFlutter?email=${Uri.encodeComponent(email)}&code=$code'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to verify reset password: ${response.body}');
      }
    } catch (e) {
      print('Error verifying reset password: $e');
      throw Exception('Failed to verify reset password: $e');
    }
  }

  Future<void> logout() async {
    await storage.delete(key: 'accessToken');
    await storage.delete(key: 'refreshToken');
    await storage.delete(key: 'firstName');
    await storage.delete(key: 'lastName');
    await storage.delete(key: 'email');
  }

  Future<String?> getAccessToken() async {
    return await storage.read(key: 'accessToken');
  }

  Future<String?> getRefreshToken() async {
    return await storage.read(key: 'refreshToken');
  }

  Future<String?> getUserId() async {
    return await storage.read(key: 'userId');
  }

  Future<void> saveUserId(String userId) async {
    await storage.write(key: 'userId', value: userId);
  }

  Future<String?> getFirstName() async {
    return await storage.read(key: 'firstName');
  }

  Future<String?> getLastName() async {
    return await storage.read(key: 'lastName');
  }

  Future<String?> getEmail() async {
    return await storage.read(key: 'email');
  }
}
