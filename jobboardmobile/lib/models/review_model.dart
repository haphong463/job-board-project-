import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/user_model.dart';

class Review {
  final int id;
  final String title;
  final String description;
  final double rating;
  final Company company;
  final User user;
  final String username;
  final String imageUrl;
  int likeCount;
  bool likedByCurrentUser;
  Review({
    required this.id,
    required this.title,
    required this.description,
    required this.rating,
    required this.company,
    required this.user,
    required this.username,
    required this.imageUrl,
    required this.likeCount,
    required this.likedByCurrentUser,
  });

  // Factory constructor for empty review
  factory Review.empty() => Review(
        id: 0,
        title: '',
        description: '',
        rating: 0.0,
        company: Company.empty(),
        user: User.empty(),
        username: '',
        imageUrl: '',
        likeCount: 0,
        likedByCurrentUser: false,
      );

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      rating: (json['rating'] ?? 0.0).toDouble(),
      company: json['company'] != null
          ? Company.fromJson(json['company'])
          : Company.empty(),
      user: json['user'] != null ? User.fromJson(json['user']) : User.empty(),
      username: json['username'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      likeCount: json['likeCount'] ?? 0,
      likedByCurrentUser: json['likedByCurrentUser'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'rating': rating,
      'company': company.toJson(),
      'user': user.toJson(),
      'username': username,
      'imageUrl': imageUrl,
      'likeCount': likeCount,
      'likedByCurrentUser': likedByCurrentUser,
    };
  }
}
