import 'package:jobboardmobile/models/content_model.dart';

class BlogModel {
  List<Content> content;
  int currentPage;
  int totalPages;
  int totalItems;

  BlogModel({
    required this.content,
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
  });

  // Factory method to create a BlogModel from JSON
  factory BlogModel.fromJson(Map<String, dynamic> json) {
    return BlogModel(
      content: List<Content>.from(
          json['content'].map((item) => Content.fromJson(item))),
      currentPage: json['currentPage'],
      totalPages: json['totalPages'],
      totalItems: json['totalItems'],
    );
  }
}
