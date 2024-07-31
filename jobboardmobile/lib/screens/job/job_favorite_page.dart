import 'package:flutter/material.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/favorite_job_model.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:jobboardmobile/service/favorite_job_service.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/constant/endpoint.dart';

class JobFavoritePage extends StatefulWidget {
  @override
  _JobFavoritePageState createState() => _JobFavoritePageState();
}

class _JobFavoritePageState extends State<JobFavoritePage> {
  final FavoriteJobService _favoriteJobService = FavoriteJobService();
  final AuthService _authService = AuthService();
  late Future<List<FavoriteJob>> _futureFavoriteJobs;

  @override
  void initState() {
    super.initState();
    _futureFavoriteJobs = _favoriteJobService.getFavoriteJobsForUser();
  }

  String formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays >= 30) {
      return '${(difference.inDays / 30).floor()} month${(difference.inDays / 30).floor() > 1 ? 's' : ''} ago';
    } else if (difference.inDays >= 7) {
      return '${(difference.inDays / 7).floor()} week${(difference.inDays / 7).floor() > 1 ? 's' : ''} ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes > 1 ? 's' : ''} ago';
    } else {
      return '${difference.inSeconds} second${difference.inSeconds > 1 ? 's' : ''} ago';
    }
  }

  void _handleJobDetailClick(
      BuildContext context, int jobId, Company companyId) {
    Navigator.pushNamed(context, '/jobDetail/$jobId/$companyId');
  }

  void _handleCompanyClick(BuildContext context, Company companyId) {
    Navigator.pushNamed(context, '/companyDetail/$companyId');
  }

  void _handleCategoryClick(BuildContext context, int categoryId) {
    Navigator.pushNamed(context, '/jobList/$categoryId');
  }

  void _handleSaveJob(FavoriteJob favoriteJob) async {
    try {
      await _favoriteJobService.deleteFavoriteJob(favoriteJob.id);
      setState(() {
        _futureFavoriteJobs = _favoriteJobService.getFavoriteJobsForUser();
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to remove job from favorites')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Saved Jobs'),
      ),
      body: FutureBuilder<List<FavoriteJob>>(
        future: _futureFavoriteJobs,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No saved jobs found'));
          }

          final favoriteJobs = snapshot.data!;

          return ListView.builder(
            itemCount: favoriteJobs.length,
            itemBuilder: (context, index) {
              final job = favoriteJobs[index];
              final address = job.job.company.location.isNotEmpty
                  ? job.job.company.location.split(', ').takeLast(2).join(', ')
                  : '';
              final timeAgo = formatDateTime(job.job.createdAt);

              return Card(
                margin: EdgeInsets.all(8.0),
                child: ListTile(
                  contentPadding: EdgeInsets.all(8.0),
                  leading: job.job.company.logo.isNotEmpty
                      ? Image.network(
                          '${Endpoint.baseUrl}/images/${job.job.company.logo}',
                          width: 64,
                          height: 64,
                          fit: BoxFit.cover,
                        )
                      : null,
                  title: Text(job.job.title),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Posted $timeAgo'),
                      Text('Location: $address'),
                      Row(
                        children: job.job.categories.map((skill) {
                          return GestureDetector(
                            onTap: () =>
                                _handleCategoryClick(context, skill.id),
                            child: Chip(label: Text(skill.name)),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                  trailing: IconButton(
                    icon: Icon(Icons.favorite, color: Colors.red),
                    onPressed: () => _handleSaveJob(job),
                  ),
                  onTap: () => _handleJobDetailClick(
                      context, job.job.id, job.job.company),
                  onLongPress: () =>
                      _handleCompanyClick(context, job.job.company),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
