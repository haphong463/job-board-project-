import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/user_model.dart';

class Review {
  int id;
  String title;
  String description;
  double rating;
  Company company;
  User user;

  Review(
      {required this.id,
      required this.title,
      required this.description,
      required this.rating,
      required this.company,
      required this.user});

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        rating: json['rating'],
        company: json['company'],
        user: json['user']);
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': title,
      'description': description,
      'rating': rating,
      'company': company,
      'user': user
    };
  }
}
