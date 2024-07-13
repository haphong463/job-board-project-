import 'package:jobboardmobile/models/category_model.dart';
import 'package:jobboardmobile/models/user_model.dart';

class Content {
  int id;
  String title;
  String content;
  List<Category> categories;
  User user;
  bool visibility;
  String slug;
  String citation;
  String imageUrl;
  String thumbnailUrl;
  DateTime createdAt;
  DateTime updatedAt;
  int commentCount;

  Content({
    required this.id,
    required this.title,
    required this.content,
    required this.categories,
    required this.user,
    required this.visibility,
    required this.slug,
    required this.citation,
    required this.imageUrl,
    required this.thumbnailUrl,
    required this.createdAt,
    required this.updatedAt,
    required this.commentCount,
  });

  // Factory method to create a Content from JSON
  factory Content.fromJson(Map<String, dynamic> json) {
    return Content(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      categories: List<Category>.from(
          json['categories'].map((item) => Category.fromJson(item))),
      user: User.fromJson(json['user']),
      visibility: json['visibility'],
      slug: json['slug'],
      citation: json['citation'],
      imageUrl: json['imageUrl'],
      thumbnailUrl: json['thumbnailUrl'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      commentCount: json['commentCount'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
    };
  }
}
