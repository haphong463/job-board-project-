import 'package:flutter/material.dart';
import '../../core/utils/color_util.dart';
import '../../models/job_model.dart';
import '../../models/company_model.dart';
import '../../constant/endpoint.dart'; // Import your endpoint

class JobDetailsScreen extends StatelessWidget {
  final Job job;
  final Company company;

  const JobDetailsScreen({
    Key? key,
    required this.job,
    required this.company,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Replace 'http://localhost:8080' with the actual endpoint URL
    String modifiedImageUrl =
        company.logo.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(job.title),
        backgroundColor: ColorUtil.primaryColor,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: SingleChildScrollView(
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
                    job.title,
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Company: ${company.companyName}',
                    style:
                        TextStyle(fontSize: 18, color: ColorUtil.tertiaryColor),
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow('Salary', job.offeredSalary),
                  _buildInfoRow('Description', job.description),
                  _buildInfoRow('Responsibilities', job.responsibilities),
                  _buildInfoRow('Required Skills', job.requiredSkills),
                  _buildInfoRow('Work Schedule', job.workSchedule),
                  _buildInfoRow('Key Skills', job.keySkills),
                  _buildInfoRow('Position', job.position),
                  _buildInfoRow('Experience', job.experience),
                  _buildInfoRow('Qualification', job.qualification),
                  _buildInfoRow('Job Type', job.jobType),
                  _buildInfoRow('Contract Type', job.contractType),
                  _buildInfoRow('Benefits', job.benefit),
                  _buildInfoRow(
                      'Created At', job.createdAt.toLocal().toString()),
                  _buildInfoRow('Slot', job.slot.toString()),
                  _buildInfoRow(
                      'Profile Approved', job.profileApproved.toString()),
                  _buildInfoRow('Super Hot', job.isSuperHot ? 'Yes' : 'No'),
                  _buildInfoRow('Expire', job.expire),
                ],
              ),
            ),
          ),
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
    );
  }

  Widget _buildInfoRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 1,
            child: Text(
              '$title:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              value,
              style: TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}
