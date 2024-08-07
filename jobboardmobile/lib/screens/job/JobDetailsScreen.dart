import 'package:flutter/material.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import '../../core/utils/color_util.dart';
import '../../models/job_model.dart';
import '../../models/company_model.dart';
import '../../constant/endpoint.dart';
import '../../service/jobApplication_service.dart';

import 'ApplyJobForm.dart';

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
  final JobApplicationService _appService = JobApplicationService();
  bool _hasApplied = false;
  int? _userId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeUserIdAndCheckStatus();
  }

  Future<void> _initializeUserIdAndCheckStatus() async {
    int? id = await _appService.getUserId();
    if (id != null) {
      _userId = id;
      await _checkApplicationStatus();
    } else {
      print('User ID not found in storage');
    }
    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _checkApplicationStatus() async {
    if (_userId != null) {
      try {
        bool hasApplied = await _appService.hasAppliedForJob(_userId!, widget.job.id);
        setState(() {
          _hasApplied = hasApplied;
        });
      } catch (e) {
        print('Failed to check application status: $e');
      }
    }
  }

  Future<void> _refreshStatus() async {
    setState(() {
      _isLoading = true;
    });
    await _checkApplicationStatus();
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    String modifiedImageUrl =
        widget.company.logo.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.job.title),
        backgroundColor: ColorUtil.primaryColor,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
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
                          widget.job.title,
                          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Company: ${widget.company.companyName}',
                          style: TextStyle(fontSize: 18, color: ColorUtil.tertiaryColor),
                        ),
                        const SizedBox(height: 16),
                        _buildInfoRow('Salary', widget.job.offeredSalary),
                        _buildInfoRow('Description', widget.job.description),
                        _buildInfoRow('Responsibilities', widget.job.responsibilities),
                        _buildInfoRow('Required Skills', widget.job.requiredSkills),
                        _buildInfoRow('Work Schedule', widget.job.workSchedule),
                        _buildInfoRow('Key Skills', widget.job.keySkills),
                        _buildInfoRow('Position', widget.job.position),
                        _buildInfoRow('Experience', widget.job.experience),
                        _buildInfoRow('Qualification', widget.job.qualification),
                        _buildInfoRow('Job Type', widget.job.jobType),
                        _buildInfoRow('Contract Type', widget.job.contractType),
                        _buildInfoRow('Benefits', widget.job.benefit),
                        _buildInfoRow('Created At', widget.job.createdAt.toLocal().toString()),
                        _buildInfoRow('Slot', widget.job.slot.toString()),
                        _buildInfoRow('Profile Approved', widget.job.profileApproved.toString()),
                        _buildInfoRow('Super Hot', widget.job.isSuperHot ? 'Yes' : 'No'),
                        _buildInfoRow('Expire', widget.job.expire),
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
                        onPressed: _hasApplied || _userId == null
                            ? null
                            : () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) => ApplyJobForm(
                                      job: widget.job,
                                      company: widget.company,
                                      userId: _userId!,
                                      onApplicationSubmitted: () {
                                        setState(() {
                                          _hasApplied = true;
                                        });
                                        _refreshStatus();
                                      },
                                    ),
                                  ),
                                );
                              },
                        child: Text(_hasApplied ? 'Applied' : 'Send Application'),
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
