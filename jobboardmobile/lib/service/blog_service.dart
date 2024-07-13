import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/models/blog_model.dart';

class BlogService {
  final String baseUrl = 'http://192.168.1.17:8080/api/blogs';

  Future<BlogModel> searchBlogs(String query, String type,
      {int page = 0, int size = 10, int visibility = 2}) async {
    final response = await http.get(Uri.parse(
        '$baseUrl/search?query=$query&type=$type&page=$page&size=$size&visibility=$visibility'));

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      return BlogModel.fromJson(jsonResponse);
    } else {
      throw Exception('Failed to load blogs');
    }
  }
}
