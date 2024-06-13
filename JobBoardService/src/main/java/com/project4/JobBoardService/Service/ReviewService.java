package com.project4.JobBoardService.Service;


import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getAllReviews(Long companyId);

    boolean addReview(Long companyId, String username, Review review);
    Review getReview(Long companyId, Long reviewId, String username);
    boolean updateReview(Long companyId, Long reviewId, String username, Review updatedReview);

    Company convertCompanyToEntity(CompanyDTO companyDTO);
}
