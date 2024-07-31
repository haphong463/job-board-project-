import 'package:jobboardmobile/models/job_model.dart';

class Category {
  int id;
  String name;
  Set<Job> jobs;

  Category({required this.id, required this.name, required this.jobs});

  // Factory method to create a Category from JSON
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      jobs: (json['jobs'] as List<dynamic>)
          .map((e) => Job.fromJson(e as Map<String, dynamic>))
          .toSet(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'jobs': jobs.map((e) => e.toJson()).toList(),
    };
  }
}
