import 'dart:math';

import 'package:flutter/material.dart'; // Adjust the import based on your project structure
import '../../dto/application_dto.dart';
import '../../service/jobApplication_service.dart';  // Ensure you have this import
import '../../constant/endpoint.dart';

class ApplyJobsScreen extends StatefulWidget {
  @override
  _ApplyJobsScreenState createState() => _ApplyJobsScreenState();
}

class _ApplyJobsScreenState extends State<ApplyJobsScreen> {
  final JobApplicationService _appService = JobApplicationService();
  late Future<List<ApplicationDTO>> _futureAppliedJobs;
  int? userId;

  @override
  void initState() {
    super.initState();
    _initializeUserId();
    _futureAppliedJobs = _appService.fetchAppliedJobsById();
  }

  Future<void> _initializeUserId() async {
    int? id = await _appService.getUserId();
    print(id);
    if (id != null) {
      setState(() {
        userId = id;
      });
    } else {
      print('User ID not found in storage');
    }
  }
  Widget applicationCard(ApplicationDTO application) {
    
    String imageUrl = application.companyDTO.logo.replaceAll('http://localhost:8080', Endpoint.imageUrl);
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              application.jobDTO.title,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.rectangle,
                    borderRadius: BorderRadius.circular(8),
                    image: DecorationImage(
                      fit: BoxFit.cover,
                      image: NetworkImage(imageUrl),
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  application.companyDTO.companyName,
                  style: TextStyle(fontSize: 16),
                ),
              ],
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.attach_money, color: Colors.grey[600], size: 20),
                SizedBox(width: 4),
                Text(
                  'Offered salary: ${application.jobDTO.offeredSalary}',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.business_center, color: Colors.grey[600], size: 20),
                SizedBox(width: 4),
                Text(
                  application.jobDTO.jobType ?? 'N/A',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.location_on, color: Colors.grey[600], size: 20),
                SizedBox(width: 4),
                Text(
                  application.companyDTO.location ?? 'N/A',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
            SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text(application.jobDTO.keySkills)),
              ],
            ),
          ],
        ),
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text('My Applications', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Color(0xFF89BA16),
        elevation: 0,
      ),
      body: FutureBuilder<List<ApplicationDTO>>(
        future: _futureAppliedJobs,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF89BA16)),
              ),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 48, color: Colors.red),
                  SizedBox(height: 16),
                  Text('Error: ${snapshot.error}', style: TextStyle(fontSize: 16)),
                ],
              ),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.folder_open, size: 48, color: Color(0xFF89BA16)),
                  SizedBox(height: 16),
                  Text('No applications found', style: TextStyle(fontSize: 16)),
                ],
              ),
            );
          } else {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                return applicationCard(snapshot.data![index]);
              },
            );
          }
        },
      ),
    );
  }
}