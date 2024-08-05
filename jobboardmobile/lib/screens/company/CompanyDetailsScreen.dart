import 'package:flutter/material.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/utils/color_util.dart';
import '../../service/job_service.dart';
import '../job/JobDetailsScreen.dart';
import '../../constant/endpoint.dart'; // Import your endpoint

class CompanyDetailsScreen extends StatefulWidget {
  final Company company;

  const CompanyDetailsScreen({Key? key, required this.company})
      : super(key: key);

  @override
  _CompanyDetailsScreenState createState() => _CompanyDetailsScreenState();
}

class _CompanyDetailsScreenState extends State<CompanyDetailsScreen> {
  final JobService _jobService = JobService();
  List<Job> _jobs = [];

  @override
  void initState() {
    super.initState();
    _fetchJobsForCompany();
  }

  Future<void> _fetchJobsForCompany() async {
    try {
      final allJobs = await _jobService.getAllJobs();
      final companyJobs = allJobs
          .where((job) => job.companyId == widget.company.companyId)
          .toList();
      setState(() {
        _jobs = companyJobs;
      });
    } catch (e) {
      print('Failed to load jobs: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    // Replace 'http://localhost:8080' with the actual endpoint URL
    String modifiedImageUrl = widget.company.logo
        .replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.company.companyName),
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
            _buildInfoRow('Company Name', widget.company.companyName),
            _buildInfoRow('Description', widget.company.description),
            _buildInfoRow('Location', widget.company.location),
            _buildInfoRow('Website', widget.company.websiteLink, isLink: true),
            _buildInfoRow('Key Skills', widget.company.keySkills),
            _buildInfoRow('Type', widget.company.type),
            _buildInfoRow('Company Size', widget.company.companySize),
            _buildInfoRow('Country', widget.company.country),
            _buildInfoRow('Country Code', widget.company.countryCode),
            _buildInfoRow('Working Days', widget.company.workingDays),
            _buildInfoRow('Membership Required',
                widget.company.membershipRequired ? 'Yes' : 'No'),
            const SizedBox(height: 16),
            Text(
              'Jobs at ${widget.company.companyName}',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _jobs.isEmpty
                ? Center(child: Text('No jobs available'))
                : ListView.builder(
                    shrinkWrap: true,
                    itemCount: _jobs.length,
                    itemBuilder: (context, index) {
                      final job = _jobs[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        elevation:
                            5, // Added elevation for better visual effect
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(modifiedImageUrl),
                            radius: 30, // Adjust size as needed
                          ),
                          title: Text(job.title,
                              style: TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Text(job.offeredSalary,
                              //     style: TextStyle(color: Colors.green)),
                              Text(job.description,
                                  maxLines: 2, overflow: TextOverflow.ellipsis),
                            ],
                          ),
                          isThreeLine: true,
                          onTap: () {
                            // Navigate to JobDetailsScreen
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => JobDetailsScreen(
                                  job: job,
                                  company: widget.company,
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String title, String value, {bool isLink = false}) {
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
            child: isLink
                ? InkWell(
                    onTap: () => _launchURL(value),
                    child: Text(
                      value,
                      style: TextStyle(color: Colors.blue, fontSize: 16),
                    ),
                  )
                : Text(
                    value,
                    style: TextStyle(fontSize: 16),
                  ),
          ),
        ],
      ),
    );
  }

  void _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
