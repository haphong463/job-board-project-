import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import '../../core/utils/color_util.dart';
import '../../models/job_model.dart';
import '../../models/company_model.dart';
import '../../constant/endpoint.dart'; // Import your endpoint
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<int, String>> fetchCategories() async {
  try {
    final response =
        await http.get(Uri.parse('http://192.168.1.3:8080/api/categories'));

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

class JobDetailsScreen extends StatefulWidget {
  final Job job;
  final Company company;
  final bool isHtml;

  const JobDetailsScreen({
    Key? key,
    required this.job,
    required this.company,
    required this.isHtml,
  }) : super(key: key);

  @override
  _JobDetailsScreenState createState() => _JobDetailsScreenState();
}

class _JobDetailsScreenState extends State<JobDetailsScreen> {
  late Future<Map<int, String>> _categoryFuture;

  @override
  void initState() {
    super.initState();
    _categoryFuture = fetchCategories(); // Initialize category fetching
  }

  @override
  Widget build(BuildContext context) {
    String modifiedImageUrl = widget.company.logo
        .replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.job.title),
        backgroundColor: ColorUtil.primaryColor,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Image.network(
                modifiedImageUrl,
                height: 100,
                width: 100,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              widget.job.title,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            FutureBuilder<Map<int, String>>(
              future: _categoryFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Text('Error loading categories: ${snapshot.error}');
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Text('No categories available');
                } else {
                  final categoryMap = snapshot.data!;
                  return _buildCategoriesRow(categoryMap);
                }
              },
            ),
            const SizedBox(height: 16),
            _buildInfoRow(
                Icons.attach_money, 'Salary', widget.job.offeredSalary),
            _buildInfoRow(
                Icons.description, 'Description', widget.job.description,
                isHtml: true),
            _buildInfoRow(
                Icons.work, 'Responsibilities', widget.job.responsibilities,
                isHtml: true),
            _buildInfoRow(Icons.star, 'Your Skills', widget.job.requiredSkills,
                isHtml: true),
            _buildInfoRow(
                Icons.schedule, 'Work Schedule', widget.job.workSchedule,
                isHtml: true),
            _buildInfoRow(Icons.label, 'Level', widget.job.position),
            _buildInfoRow(Icons.work, 'Experience', widget.job.experience),
            _buildInfoRow(Icons.category, 'Job Type', widget.job.jobType),
            _buildInfoRow(
                Icons.assignment, 'Contract Type', widget.job.contractType),
            _buildInfoRow(Icons.card_giftcard, 'Benefits', widget.job.benefit,
                isHtml: true),
            _buildInfoRow(Icons.calendar_today, 'Expire', widget.job.expire),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      // Handle Save Job action
                    },
                    child: Text('Save Job'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ColorUtil.primaryColor,
                      padding: EdgeInsets.symmetric(horizontal: 16.0),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      // Handle Send Application action
                    },
                    child: Text('Send Application'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ColorUtil.primaryColor,
                      padding: EdgeInsets.symmetric(horizontal: 16.0),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriesRow(Map<int, String> categoryMap) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Wrap(
              spacing: 8.0,
              runSpacing: 4.0,
              children: widget.job.categoryId.map((categoryId) {
                final categoryName = categoryMap[categoryId] ?? 'Unknown';
                return Chip(label: Text(categoryName));
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String value,
      {bool isHtml = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 24, color: ColorUtil.primaryColor),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ],
          ),
          const SizedBox(height: 4), // Space between title and content
          isHtml
              ? Html(
                  data: value,
                  style: {
                    'body': Style(
                      fontSize: FontSize(16),
                      lineHeight: LineHeight(1.7),
                      color: Colors.black, // Set text color to black
                    ),
                  },
                )
              : Text(
                  value,
                  style: TextStyle(
                      fontSize: 16,
                      color: Colors.black), // Set text color to black
                ),
        ],
      ),
    );
  }
}
