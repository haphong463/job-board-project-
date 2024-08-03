import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/models/review_model.dart';
import 'package:jobboardmobile/service/review_service.dart';

import '../../models/company_model.dart';
import '../../models/user_model.dart';

class CompanyReviewScreen extends StatefulWidget {
  final int companyId;

  const CompanyReviewScreen({Key? key, required this.companyId})
      : super(key: key);

  @override
  _CompanyReviewScreenState createState() => _CompanyReviewScreenState();
}

class _CompanyReviewScreenState extends State<CompanyReviewScreen> {
  final ReviewService _reviewService = ReviewService();
  final AuthService _authService = AuthService();
  List<Review> _reviews = [];
  bool _hasReviewed = false;
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  double _rating = 0.0;

  String? _username;

  @override
  void initState() {
    super.initState();
    _fetchUserInfo();
    _fetchReviews();
    _checkUserReviewStatus();
  }

  Future<void> _fetchUserInfo() async {
    try {
      final username = await _authService.getUsername();
      setState(() {
        _username = username;
      });
    } catch (e) {
      print('Failed to fetch user info: $e');
    }
  }

  Future<void> _fetchReviews() async {
    try {
      final reviews = await _reviewService.getAllReviews(widget.companyId);
      setState(() {
        _reviews = reviews;
      });
    } catch (e) {
      print('Failed to load reviews: $e');
    }
  }

  Future<void> _checkUserReviewStatus() async {
    try {
      if (_username != null) {
        final hasReviewed =
            await _reviewService.hasUserReviewedCompany(widget.companyId);
        setState(() {
          _hasReviewed = hasReviewed;
        });
      }
    } catch (e) {
      print('Failed to check review status: $e');
    }
  }

  Future<void> _addReview() async {
    if (_titleController.text.isEmpty || _descriptionController.text.isEmpty) {
      print('Title and description cannot be empty');
      return;
    }

    if (_username == null) {
      print('User not logged in');
      return;
    }

    if (_hasReviewed) {
      print('You have already reviewed this company');
      return;
    }

    try {
      final review = Review(
        id: 0,
        title: _titleController.text,
        description: _descriptionController.text,
        rating: _rating,
        company: Company.empty(), // Update if necessary
        user: User.empty(), // Update if necessary
        username: _username!,
        imageUrl: '', // Optional
      );

      await _reviewService.addReview(widget.companyId, review);
      _titleController.clear();
      _descriptionController.clear();
      setState(() {
        _rating = 0.0;
      });
      await _fetchReviews(); // Fetch reviews again to show the new review
      await _checkUserReviewStatus(); // Update review status
    } catch (e) {
      print('Failed to add review: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Company Reviews'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reviews:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: _reviews.isEmpty
                  ? Center(child: Text('No reviews available'))
                  : ListView.builder(
                      itemCount: _reviews.length,
                      itemBuilder: (context, index) {
                        final review = _reviews[index];
                        return ListTile(
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(
                              review.imageUrl.isNotEmpty
                                  ? review.imageUrl
                                  : 'https://bootdey.com/img/Content/avatar/avatar6.png',
                            ),
                            backgroundColor: Colors.grey[300],
                          ),
                          title: Text(review.title),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('By: ${review.username}'),
                              Text(
                                  'Rating: ${review.rating.toStringAsFixed(1)}'),
                              Text(review.description),
                            ],
                          ),
                        );
                      },
                    ),
            ),
            if (!_hasReviewed)
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Add your review:',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _titleController,
                      decoration: InputDecoration(
                        labelText: 'Title',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _descriptionController,
                      decoration: InputDecoration(
                        labelText: 'Description',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 8),
                    RatingBar.builder(
                      initialRating: _rating,
                      minRating: 1,
                      direction: Axis.horizontal,
                      allowHalfRating: true,
                      itemCount: 5,
                      itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                      itemBuilder: (context, _) => Icon(
                        Icons.star,
                        color: Colors.amber,
                      ),
                      onRatingUpdate: (rating) {
                        setState(() {
                          _rating = rating;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _addReview,
                      child: Text('Submit Review'),
                    ),
                  ],
                ),
              )
            else
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: Text(
                  'You have already submitted a review for this company.',
                  style:
                      TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
