import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
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
    String companyName = widget.company.companyName ?? 'Company Name';
    String companyDescription = widget.company.description ?? 'No Description';
    String companyLogo = widget.company.logo ?? '';
    String companyLocation = widget.company.location ?? 'No Location';
    String companyWebsite = widget.company.websiteLink ?? 'No Website';
    String companyKeySkills = widget.company.keySkills ?? 'No Key Skills';
    String companyType = widget.company.type ?? 'No Type';
    String companySize = widget.company.companySize ?? 'No Company Size';
    String companyCountry = widget.company.country ?? 'No Country';
    String companyCountryCode = widget.company.countryCode ?? 'No Country Code';
    String companyWorkingDays = widget.company.workingDays ?? 'No Working Days';
    String companyMembershipRequired =
        widget.company.membershipRequired ? 'Yes' : 'No';

    String modifiedImageUrl =
        companyLogo.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(companyName),
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
            _buildInfoRow('', companyName),
            _buildInfoRow('', companyDescription, isHtml: true),
            _buildInfoRow('Location', companyLocation),
            _buildInfoRow('Website', companyWebsite, isLink: true),
            _buildInfoRow('Key Skills', companyKeySkills),
            _buildInfoRow('Type', companyType),
            _buildInfoRow('Company Size', companySize),
            _buildInfoRow('Country', companyCountry),
            _buildInfoRow('Country Code', companyCountryCode),
            _buildInfoRow('Working Days', companyWorkingDays),
            _buildInfoRow('Membership Required', companyMembershipRequired),
            const SizedBox(height: 16),
            Text(
              'Jobs at $companyName',
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
                        elevation: 5,
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(modifiedImageUrl),
                            radius: 30,
                          ),
                          title: Text(job.title ?? 'No Title',
                              style: TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(job.offeredSalary ?? 'No Salary',
                                  style: TextStyle(color: Colors.green)),
                              const SizedBox(height: 10),
                              Html(
                                data: job.description ?? 'No Description',
                                style: {
                                  "body": Style(
                                      fontSize: FontSize(16.0),
                                      listStyleType: ListStyleType.none),
                                },
                              ),
                            ],
                          ),
                          isThreeLine: true,
                          onTap: () {
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

  Widget _buildInfoRow(String title, String value,
      {bool isLink = false, bool isHtml = false}) {
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
                : isHtml
                    ? Html(
                        data: value,
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
