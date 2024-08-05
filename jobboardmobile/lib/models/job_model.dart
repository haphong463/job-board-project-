import 'package:flutter/material.dart';

class Job {
  final int id;
  final String title;
  final int offeredSalary; // Giả sử offeredSalary là số
  final String description;
  final String responsibilities;
  final String requiredSkills;
  final String workSchedule;
  final String keySkills;
  final String position;
  final String experience;
  final String qualification;
  final String jobType;
  final String contractType;
  final String? benefit; // Nullable nếu có thể là null
  final DateTime createdAt;
  final int slot;
  final int profileApproved;
  final bool? isSuperHot; // Nullable nếu có thể là null
  final List<int> categoryIds;
  final int? companyId; // Nullable nếu có thể là null
  final String expire; // Đảm bảo thuộc tính expire được khai báo đúng cách
  final bool isHidden;
  
  Job({
    required this.id,
    required this.title,
    required this.offeredSalary,
    required this.description,
    required this.responsibilities,
    required this.requiredSkills,
    required this.workSchedule,
    required this.keySkills,
    required this.position,
    required this.experience,
    required this.qualification,
    required this.jobType,
    required this.contractType,
    this.benefit,
    required this.createdAt,
    required this.slot,
    required this.profileApproved,
    this.isSuperHot,
    required this.categoryIds,
    this.companyId,
    required this.expire,
    required this.isHidden,
  });

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['id'] as int,
      title: json['title'] as String? ?? 'No title',
      offeredSalary: json['offeredSalary'] as int? ?? 0,
      description: json['description'] as String? ?? 'No description',
      responsibilities: json['responsibilities'] as String? ?? 'No responsibilities',
      requiredSkills: json['requiredSkills'] as String? ?? 'No required skills',
      workSchedule: json['workSchedule'] as String? ?? 'No work schedule',
      keySkills: json['keySkills'] as String? ?? 'No key skills',
      position: json['position'] as String? ?? 'No position',
      experience: json['experience'] as String? ?? 'No experience',
      qualification: json['qualification'] as String? ?? 'No qualification',
      jobType: json['jobType'] as String? ?? 'No job type',
      contractType: json['contractType'] as String? ?? 'No contract type',
      benefit: json['benefit'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      slot: json['slot'] as int? ?? 0,
      profileApproved: json['profileApproved'] as int? ?? 0,
      isSuperHot: json['isSuperHot'] as bool?,
      categoryIds: List<int>.from(json['categoryIds'] as List<dynamic>),
      companyId: json['companyId'] as int?,
    expire: json['expire'] as String? ?? 'No expiration date', // Chỉnh sửa tên trường từ 'expired' thành 'expire' nếu cần
      isHidden: json['isHidden'] as bool? ?? false, // Thêm giá trị mặc định cho isHidden
    );
  }
}
