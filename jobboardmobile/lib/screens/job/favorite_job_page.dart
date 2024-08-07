import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:jobboardmobile/screens/job/JobDetailsScreen.dart';
import 'package:jobboardmobile/service/favoriteJob_service.dart';
import 'package:jobboardmobile/models/favorite_job_model.dart';
import 'package:jobboardmobile/service/job_service.dart';
import 'package:http/http.dart' as http;

Future<Map<int, String>> fetchCategories() async {
  try {
    const String baseUrl = '${Endpoint.baseUrl}/categories';

    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);

      if (data.isNotEmpty &&
          data.every((item) => item is Map<String, dynamic>)) {
        return Map<int, String>.fromEntries(
          data.map((category) {
            final id = category['categoryId'];
            final name = category['categoryName'];

            if (id is int && name is String) {
              return MapEntry(id, name);
            } else {
              throw Exception('Invalid category data format');
            }
          }),
        );
      } else {
        throw Exception('Invalid JSON format');
      }
    } else {
      throw Exception(
          'Failed to load categories, status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error fetching categories: $e');
    rethrow;
  }
}

class FavoriteJobsScreen extends StatefulWidget {
  const FavoriteJobsScreen({super.key});

  @override
  _FavoriteJobsScreenState createState() => _FavoriteJobsScreenState();
}

class _FavoriteJobsScreenState extends State<FavoriteJobsScreen> {
  late Future<Map<int, String>> _categoryFuture;
  late Future<List<FavoriteJob>> _favoriteJobsFuture;
  final FavoriteJobService _favoriteJobService = FavoriteJobService();

  @override
  void initState() {
    super.initState();
    _categoryFuture = fetchCategories().then((categories) {
      print('Categories fetched: $categories'); // Debug line
      return categories;
    }).catchError((error) {
      print('Error fetching categories: $error'); // Debug line
      return {}; // Provide an empty map in case of error
    });
    _refreshFavoriteJobs();
  }

  Future<void> _refreshFavoriteJobs() async {
    setState(() {
      _favoriteJobsFuture = _favoriteJobService.getFavoriteJobsForUser();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Favorite Jobs'),
        backgroundColor: Colors.blue,
      ),
      body: FutureBuilder<List<FavoriteJob>>(
        future: _favoriteJobsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No favorite jobs found.'));
          } else {
            final favoriteJobs = snapshot.data!;

            return ListView.builder(
              itemCount: favoriteJobs.length,
              itemBuilder: (context, index) {
                final favoriteJob = favoriteJobs[index];
                String modifiedImageUrl = favoriteJob.companyLogo
                    .replaceAll('http://localhost:8080', Endpoint.imageUrl);

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Card(
                    elevation: 2.0,
                    child: ListTile(
                      leading: modifiedImageUrl.isNotEmpty
                          ? Image.network(
                              modifiedImageUrl,
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                            )
                          : const SizedBox(
                              width: 50,
                              height: 50, // Placeholder if no logo
                              child: Icon(Icons
                                  .image_not_supported), // Hiển thị icon nếu không có logo
                            ),
                      title: Text(favoriteJob.jobTitle),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(favoriteJob.position),
                          const SizedBox(height: 4, width: 0.4),
                          FutureBuilder<Map<int, String>>(
                            future: _categoryFuture,
                            builder: (context, categorySnapshot) {
                              if (categorySnapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return const CircularProgressIndicator();
                              } else if (categorySnapshot.hasError) {
                                return const Text('Error loading categories');
                              } else if (!categorySnapshot.hasData ||
                                  categorySnapshot.data!.isEmpty) {
                                return const Text('No categories available');
                              } else {
                                final categoryMap = categorySnapshot.data!;
                                return _SkillsWidget(
                                  categoryId: favoriteJob.categoryId,
                                  categoryMap: categoryMap,
                                );
                              }
                            },
                          ),
                        ],
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => JobDetailsScreen(
                              job: Job(
                                id: favoriteJob.jobId,
                                title: favoriteJob.jobTitle,
                                offeredSalary: favoriteJob.offeredSalary,
                                description: favoriteJob.jobDescription,
                                responsibilities: favoriteJob.responsibilities,
                                requiredSkills: favoriteJob.requiredSkills,
                                workSchedule: favoriteJob.workSchedule,
                                position: favoriteJob.position,
                                experience: favoriteJob.experience,
                                qualification: favoriteJob.qualification,
                                jobType: favoriteJob.jobType,
                                contractType: favoriteJob.contractType,
                                benefit: favoriteJob.benefit,
                                createdAt:
                                    DateTime.parse(favoriteJob.createdAt),
                                slot: favoriteJob.slot,
                                profileApproved: 0,
                                isSuperHot: false,
                                companyId: favoriteJob.companyId,
                                expire: favoriteJob.expire,
                                categoryId: favoriteJob.categoryId,
                                keySkills: '',
                                isHidden: false,
                              ),
                              company: Company(
                                companyId: favoriteJob.companyId,
                                companyName: favoriteJob.companyName,
                                logo: favoriteJob.companyLogo,
                                websiteLink: favoriteJob.websiteLink,
                                description: favoriteJob.companyDescription,
                                location: favoriteJob.location,
                                keySkills: favoriteJob.keySkills,
                                type: favoriteJob.type,
                                companySize: favoriteJob.companySize,
                                country: favoriteJob.country,
                                countryCode: favoriteJob.countryCode,
                                workingDays: favoriteJob.workingDays,
                                membershipRequired: false,
                              ),
                              isHtml: true,
                            ),
                          ),
                        );
                      },
                      trailing: IconButton(
                        icon: const Icon(Icons.favorite_border),
                        onPressed: () async {
                          await _favoriteJobService
                              .deleteFavoriteJob(favoriteJob.id);
                          setState(() {
                            _favoriteJobsFuture =
                                _favoriteJobService.getFavoriteJobsForUser();
                          });
                        },
                      ),
                    ),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}

class _SkillsWidget extends StatelessWidget {
  final List<int> categoryId;
  final Map<int, String> categoryMap;

  const _SkillsWidget({
    required this.categoryId,
    required this.categoryMap,
  });

  @override
  Widget build(BuildContext context) {
    final displayedCategories = categoryId.take(2).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 8.0,
          runSpacing: 4.0,
          children: displayedCategories.map((id) {
            final name = categoryMap[id] ?? 'Unknown';
            return Chip(
              label: Text(name),
            );
          }).toList(),
        ),
        if (categoryId.length > 2)
          TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MoreCategoriesScreen(
                    categories: categoryId
                        .map((id) => categoryMap[id] ?? 'Unknown')
                        .toList(),
                  ),
                ),
              );
            },
            child: const Text('View more'),
          ),
      ],
    );
  }
}

class MoreCategoriesScreen extends StatelessWidget {
  final List<String> categories;

  const MoreCategoriesScreen({
    super.key,
    required this.categories,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Skill job'),
      ),
      body: ListView.builder(
        itemCount: categories.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(categories[index]),
          );
        },
      ),
    );
  }
}
