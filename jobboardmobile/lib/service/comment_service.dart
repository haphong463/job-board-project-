import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/models/comment_model.dart';

class CommentService {
  static const String baseUrl = 'http://192.168.1.17:8080/api/comments';

  Future<List<Comment>> getCommentsByBlogSlug(String slug) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/blog/$slug'));
      if (response.statusCode == 200) {
        List<dynamic> jsonList = jsonDecode(response.body);
        List<Comment> comments =
            jsonList.map((json) => Comment.fromJson(json)).toList();
        return comments;
      } else {
        throw Exception('Failed to load comments');
      }
    } catch (e) {
      throw Exception('Failed to load comments: $e');
    }
  }

  Future<Comment> createComment(var comment) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization':
              'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoYXBob25nMjEzNCIsInJvbGUiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImZpcnN0TmFtZSI6IkjDoCBUaGFuaCIsImxhc3ROYW1lIjoiUGhvbmciLCJpZCI6MSwiaW1hZ2VVcmwiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvdXBsb2Fkcy91c2VyLzExMTU2NTQ0Ml8yMDI0MDcwNDIzMTk1MC5qcGciLCJiaW8iOiJBIHBhc3Npb25hdGUgYmxvZ2dlciBhYm91dCBpbmZvcm1hdGlvbiB0ZWNobm9sb2d5IChJVCkuIFdpdGggMyB5ZWFycyBvZiBleHBlcmllbmNlIGluIHRoZSBmaWVsZCwgSSBob3BlIHRvIHNoYXJlIG15IGtub3dsZWRnZSBhbmQgcGFzc2lvbiB3aXRoIHRoZSBjb21tdW5pdHkgdGhyb3VnaCBteSBibG9nLiIsImdlbmRlciI6Ik1BTEUiLCJpYXQiOjE3MjA4NTgwMTksImV4cCI6MTcyMDk0NDQxOX0.DnzUw3xQCkVTAZnb63L6m86YItEVZPoeCORBHPJiIgZbTqklvOoUWKx_jcK7y3GzxMDt8g3IupCPVscGw-qOiw'
        },
        body: jsonEncode(comment),
      );

      if (response.statusCode == 200) {
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');
        return Comment.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create comment');
      }
    } catch (e) {
      throw Exception('Failed to create comment: $e');
    }
  }

  Future<void> deleteComment(String id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/comment/$id'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to delete comment');
      }
    } catch (e) {
      throw Exception('Failed to delete comment: $e');
    }
  }

  Future<Comment> updateComment(String id, Comment comment) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/comment/$id'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(comment.toJson()),
      );

      if (response.statusCode == 200) {
        return Comment.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to update comment');
      }
    } catch (e) {
      throw Exception('Failed to update comment: $e');
    }
  }
}
