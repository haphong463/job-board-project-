package com.project4.JobBoardService.Service;


import com.project4.JobBoardService.Entity.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getAllReviews(Long companyId);

    boolean addReview(Long companyId, Review review);

    Review getReview(Long companyId, Long reviewId);

    boolean updateReview(Long companyId, Long reviewId, Review updatedReview);

}
