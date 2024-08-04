import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:jobboardmobile/models/review_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/review_service.dart';
import 'package:jobboardmobile/constant/endpoint.dart';

import '../../dto/LikeResponse.dart';

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
  }

  Future<void> _fetchUserInfo() async {
    try {
      final username = await _authService.getUsername();
      setState(() {
        _username = username;
      });
      if (_username != null) {
        await _fetchReviews();
        await _checkUserReviewStatus();
      }
    } catch (e) {
      print('Failed to fetch user info: $e');
    }
  }

  Future<void> _fetchReviews() async {
    try {
      final reviews = await _reviewService.getAllReviews(widget.companyId);
      setState(() {
        _reviews = reviews;
        _hasReviewed = reviews.any((review) => review.username == _username);
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Title and description cannot be empty'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_username == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('User not logged in'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      final review = Review(
        id: 0,
        title: _titleController.text,
        description: _descriptionController.text,
        rating: _rating,
        company: '',
        user: '',
        username: _username!,
        imageUrl: '',
        likeCount: 0,
        likedByCurrentUser: false,
      );

      final savedReview =
          await _reviewService.addReview(widget.companyId, review);

      setState(() {
        _titleController.clear();
        _descriptionController.clear();
        _rating = 0.0;
        _hasReviewed = true;
        _reviews.add(savedReview);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Review added successfully'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to add review: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _likeReview(Review review) async {
    if (review.id == null) {
      print('Review ID is null');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Cannot like review: Review ID is missing'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      LikeResponse response =
          await _reviewService.likeReview(widget.companyId, review.id!);
      if (response.success) {
        setState(() {
          review.likeCount++;
          review.likedByCurrentUser = true;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response.message),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to like review: ${response.message}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      print('Failed to like review: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to like review: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _unlikeReview(Review review) async {
    if (review.id == null) {
      print('Review ID is null');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Cannot unlike review: Review ID is missing'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      LikeResponse response =
          await _reviewService.unlikeReview(widget.companyId, review.id!);
      if (response.success) {
        setState(() {
          review.likeCount--;
          review.likedByCurrentUser = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response.message),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to unlike review: ${response.message}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      print('Failed to unlike review: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to unlike review: $e'),
          backgroundColor: Colors.red,
        ),
      );
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
                        String modifiedImageUrl = review.imageUrl.isNotEmpty
                            ? review.imageUrl.replaceAll(
                                'http://localhost:8080', Endpoint.imageUrl)
                            : 'https://bootdey.com/img/Content/avatar/avatar6.png';

                        return ListTile(
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(modifiedImageUrl),
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
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Likes: ${review.likeCount}'),
                                  Row(
                                    children: [
                                      IconButton(
                                        icon: Icon(
                                          Icons.thumb_up,
                                          color: review.likedByCurrentUser
                                              ? Colors.blue
                                              : Colors.grey,
                                        ),
                                        onPressed: () {
                                          if (!review.likedByCurrentUser) {
                                            _likeReview(review);
                                          }
                                        },
                                      ),
                                      IconButton(
                                        icon: Icon(
                                          Icons.thumb_down,
                                          color: review.likedByCurrentUser
                                              ? Colors.red
                                              : Colors.grey,
                                        ),
                                        onPressed: () {
                                          if (review.likedByCurrentUser) {
                                            _unlikeReview(review);
                                          }
                                        },
                                      ),
                                    ],
                                  ),
                                ],
                              ),
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
          ],
        ),
      ),
    );
  }
}
