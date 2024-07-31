import 'package:jobboardmobile/models/job_model.dart';
import 'package:jobboardmobile/models/user_model.dart';

class FavoriteJob {
  int id;
  Job job;
  User user;

  FavoriteJob({
    required this.id,
    required this.job,
    required this.user,
  });

  // Factory method to create a FavoriteJob from JSON
  factory FavoriteJob.fromJson(Map<String, dynamic> json) {
    return FavoriteJob(
      id: json['id'],
      job: Job.fromJson(json['job'] as Map<String, dynamic>),
      user: User.fromJson(json['user'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'job': job.toJson(),
      'user': user.toJson(),
    };
  }
}
