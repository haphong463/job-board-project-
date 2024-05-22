package com.project4.JobBoardService.Service.Impl;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Repository.ReviewRepository;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CompanyService companyService;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, CompanyService companyService) {
        this.reviewRepository = reviewRepository;
        this.companyService = companyService;
    }

    @Override
    public List<Review> getAllReviews(Long companyId) {
        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
        return reviews;
    }

    @Override
    public boolean addReview(Long companyId, Review review) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId);
        if (companyOptional.isPresent()) {
            Company company = companyOptional.get(); // Unwrapping the Optional
            review.setCompany(company);
            reviewRepository.save(review);
            return true;
        }
        return false;
    }

    @Override
    public Review getReview(Long companyId, Long reviewId) {
        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);

        return reviews.stream().filter(review -> review.getId().equals(reviewId)).findFirst().orElse(null);
    }

    @Override
    public boolean updateReview(Long companyId, Long reviewId, Review updatedReview) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId);
        if (companyOptional.isPresent()) {
            Company company = companyOptional.get(); // Unwrapping the Optional
            updatedReview.setCompany(company);
            updatedReview.setId(reviewId);
            reviewRepository.save(updatedReview);
            return true;
        } else {
            return false; // Company with given ID not found
        }
    }

}