package com.project4.JobBoardService.Service.Impl;
import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.ReviewRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CompanyService companyService;
    private final UserRepository userRepository;
    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, CompanyService companyService, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.companyService = companyService;
        this.userRepository = userRepository;
    }

    @Override
    public List<Review> getAllReviews(Long companyId) {
        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
        return reviews;
    }

    @Override
    public boolean addReview(Long companyId, String username, Review review) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            Company company = companyOptional.get();
            User user = userOptional.get();
            review.setCompany(company);
            review.setUser(user);
            reviewRepository.save(review);
            return true;
        }
        return false;
    }
    @Override
    public Review getReview(Long companyId, Long reviewId, String username) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
            return reviews.stream()
                    .filter(review -> review.getId().equals(reviewId) && review.getUser().equals(userOptional.get()))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }


    @Override
    public boolean updateReview(Long companyId, Long reviewId, String username, Review updatedReview) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            Company company = companyOptional.get();
            User user = userOptional.get();
            updatedReview.setCompany(company);
            updatedReview.setUser(user);
            updatedReview.setId(reviewId);
            reviewRepository.save(updatedReview);
            return true;
        }
        return false;
    }

}