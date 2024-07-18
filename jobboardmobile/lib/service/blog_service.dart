import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/blog_model.dart';
import 'package:jobboardmobile/models/content_model.dart';

class BlogService {
  final String baseUrl = '${Endpoint.baseUrl}/blogs';

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

  Future<Content?> getBlogBySlug(String slug) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/$slug'));
      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return Content.fromJson(jsonResponse);
      }
    } catch (e) {
      return null;
    }
    return null;
  }
}
