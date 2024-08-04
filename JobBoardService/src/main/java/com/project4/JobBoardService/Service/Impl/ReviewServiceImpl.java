package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.ReviewLike;
import com.project4.JobBoardService.Repository.ReviewLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.ReviewRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Service.ReviewService;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CompanyService companyService;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    private final ReviewLikeRepository reviewLikeRepository;
    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, CompanyService companyService, UserRepository userRepository, ModelMapper modelMapper, ReviewLikeRepository reviewLikeRepository) {
        this.reviewRepository = reviewRepository;
        this.companyService = companyService;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.reviewLikeRepository = reviewLikeRepository;
    }

    @Override
    public List<ReviewDTO> getAllReviews(Long companyId) {
        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO addReview(Long companyId, ReviewDTO reviewDTO) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId).map(this::convertCompanyToEntity);
        Optional<User> userOptional = userRepository.findByUsername(reviewDTO.getUsername());

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            Company company = companyOptional.get();
            User user = userOptional.get();

            Review review = new Review();
            review.setTitle(reviewDTO.getTitle());
            review.setDescription(reviewDTO.getDescription());
            review.setRating(reviewDTO.getRating());
            review.setCompany(company);
            review.setUser(user);

            Review savedReview = reviewRepository.save(review);

            return convertToDTO(savedReview); // Return the DTO
        }
        return null; // Or throw an exception if needed
    }

    @Override
    public ReviewDTO getReview(Long companyId, Long reviewId, String username) {
        Optional<CompanyDTO> companyOptional = companyService.getCompanyById(companyId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
            Review review = reviews.stream()
                    .filter(r -> r.getId().equals(reviewId) && r.getUser().equals(userOptional.get()))
                    .findFirst()
                    .orElse(null);
            return review != null ? convertToDTO(review) : null;
        }
        return null;
    }



    @Override
    public boolean likeReview(Long companyId, Long reviewId, String username) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (reviewOptional.isPresent() && userOptional.isPresent()) {
            Review review = reviewOptional.get();
            User user = userOptional.get();

            if (reviewLikeRepository.existsByReviewIdAndUserId(reviewId, user.getId())) {
                return false; // User already liked the review
            }

            ReviewLike like = new ReviewLike();
            like.setReview(review);
            like.setUser(user);
            reviewLikeRepository.save(like);

            return true;
        }
        return false;
    }

    @Override
    public boolean unlikeReview(Long reviewId, String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Optional<ReviewLike> likeOptional = reviewLikeRepository.findByReviewIdAndUserId(reviewId, user.getId());

            if (likeOptional.isPresent()) {
                reviewLikeRepository.delete(likeOptional.get());
                return true;
            }
        }
        return false;
    }


    @Override
    public boolean hasUserReviewedCompany(Long companyId, String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Check if the list is empty or not
            return !reviewRepository.findByCompany_CompanyIdAndUserId(companyId, user.getId()).isEmpty();
        }
        return false;
    }
    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO reviewDTO = modelMapper.map(review, ReviewDTO.class);
        reviewDTO.setId(review.getId());
        reviewDTO.setUsername(review.getUser().getUsername());
        reviewDTO.setImageUrl(review.getUser().getImageUrl());
        reviewDTO.setLikeCount(review.getLikeCount());
        return reviewDTO;
    }

    private Company convertCompanyToEntity(CompanyDTO companyDTO) {
        Company company = new Company();
        company.setCompanyId(companyDTO.getCompanyId());
        company.setCompanyName(companyDTO.getCompanyName());
        company.setLogo(companyDTO.getLogo());
        company.setWebsiteLink(companyDTO.getWebsiteLink());
        company.setDescription(companyDTO.getDescription());
        company.setLocation(companyDTO.getLocation());
        company.setType(companyDTO.getType());
        return company;
    }




}
