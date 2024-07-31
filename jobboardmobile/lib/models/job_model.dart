import 'package:jobboardmobile/models/category_model.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/contract_type_model.dart';
import 'package:jobboardmobile/models/job_position_model.dart';
import 'package:jobboardmobile/models/job_type_model.dart';

class Job {
  int id;
  String title;
  String offeredSalary;
  String description;
  String responsibilities;
  String requiredSkills;
  String workSchedule;
  String keySkills;
  String experience;
  String qualification;
  ContractType contractType;
  String benefit;
  DateTime createdAt;
  int? slot; // Nullable because it's an Integer in Java but may not be provided
  int profileApproved; // Default value in Java
  bool isSuperHot;
  Set<Category> categories;
  Set<JobType> jobTypes;
  JobPosition jobPosition;
  Company company;
  String expire;

  Job(
      {required this.id,
      required this.title,
      required this.offeredSalary,
      required this.description,
      required this.responsibilities,
      required this.requiredSkills,
      required this.workSchedule,
      required this.keySkills,
      required this.experience,
      required this.qualification,
      required this.contractType,
      required this.benefit,
      required this.createdAt,
      this.slot,
      this.profileApproved = 0,
      required this.isSuperHot,
      required this.categories,
      required this.jobTypes,
      required this.jobPosition,
      required this.company,
      required this.expire});

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['id'],
      title: json['title'],
      offeredSalary: json['offeredSalary'],
      description: json['description'],
      responsibilities: json['responsibilities'],
      requiredSkills: json['requiredSkills'],
      workSchedule: json['workSchedule'],
      keySkills: json['keySkills'],
      experience: json['experience'],
      qualification: json['qualification'],
      contractType: ContractType.fromJson(json['contractType']),
      benefit: json['benefit'],
      createdAt: DateTime.parse(json['createdAt']),
      slot: json['slot'],
      profileApproved: json['profileApproved'] ?? 0,
      isSuperHot: json['isSuperHot'],
      categories: (json['categories'] as List<dynamic>)
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toSet(),
      jobTypes: (json['jobTypes'] as List<dynamic>)
          .map((e) => JobType.fromJson(e as Map<String, dynamic>))
          .toSet(),
      jobPosition: JobPosition.fromJson(json['jobPosition']),
      company: Company.fromJson(json['company']),
      expire: json['expire'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'offeredSalary': offeredSalary,
      'description': description,
      'responsibilities': responsibilities,
      'requiredSkills': requiredSkills,
      'workSchedule': workSchedule,
      'keySkills': keySkills,
      'experience': experience,
      'qualification': qualification,
      'contractType': contractType.toJson(),
      'benefit': benefit,
      'createdAt': createdAt.toIso8601String(),
      'slot': slot,
      'profileApproved': profileApproved,
      'isSuperHot': isSuperHot,
      'categories': categories.map((e) => e.toJson()).toList(),
      'jobTypes': jobTypes.map((e) => e.toJson()).toList(),
      'jobPosition': jobPosition.toJson(),
      'company': company.toJson(),
      'expire': expire,
    };
  }
}
