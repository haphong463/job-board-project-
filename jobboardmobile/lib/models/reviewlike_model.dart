class ReviewLike {
  final int id;
  final int reviewId;
  final int userId;

  ReviewLike({
    required this.id,
    required this.reviewId,
    required this.userId,
  });

  factory ReviewLike.fromJson(Map<String, dynamic> json) {
    return ReviewLike(
      id: json['id'],
      reviewId: json['review_id'],
      userId: json['user_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'review_id': reviewId,
      'user_id': userId,
    };
  }
}
