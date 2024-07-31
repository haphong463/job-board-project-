import 'package:jobboardmobile/models/job_model.dart';
import 'package:jobboardmobile/models/review_model.dart';

class Company {
  int companyId;
  String companyName;
  String logo;
  String websiteLink;
  String description;
  String location;
  String keySkills;
  String type;
  String companySize;
  String country;
  String countryCode;
  String workingDays;
  bool membershipRequired;
  List<Review> reviews;
  List<Job> jobs;

  Company({
    required this.companyId,
    required this.companyName,
    required this.logo,
    required this.websiteLink,
    required this.description,
    required this.location,
    required this.keySkills,
    required this.type,
    required this.companySize,
    required this.country,
    required this.countryCode,
    required this.workingDays,
    required this.reviews,
    required this.jobs,
    this.membershipRequired = false,
  });

  factory Company.fromJson(Map<String, dynamic> json) {
    return Company(
      companyId: json['companyId'],
      companyName: json['companyName'],
      logo: json['logo'],
      websiteLink: json['websiteLink'],
      description: json['description'],
      location: json['location'],
      keySkills: json['keySkills'],
      type: json['type'],
      companySize: json['companySize'],
      country: json['country'],
      countryCode: json['countryCode'],
      workingDays: json['workingDays'],
      reviews: (json['reviews'] as List<dynamic>)
          .map((e) => Review.fromJson(e as Map<String, dynamic>))
          .toList(),
      jobs: (json['jobs'] as List<dynamic>)
          .map((e) => Job.fromJson(e as Map<String, dynamic>))
          .toList(),
      membershipRequired: json['membershipRequired'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'companyId': companyId,
      'companyName': companyName,
      'logo': logo,
      'websiteLink': websiteLink,
      'description': description,
      'location': location,
      'keySkills': keySkills,
      'type': type,
      'companySize': companySize,
      'country': country,
      'countryCode': countryCode,
      'workingDays': workingDays,
      'reviews': reviews.map((e) => e.toJson()).toList(),
      'jobs': jobs.map((e) => e.toJson()).toList(),
      'membershipRequired': membershipRequired,
    };
  }
}
