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
    public Review addReview(Long companyId, ReviewDTO reviewDTO) {
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

            return savedReview;
        }
        return null; // Hoặc ném một exception nếu cần
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
    public boolean likeReview(Long reviewId, String username) {
        // In ra thông tin ban đầu
        System.out.println("Processing likeReview for reviewId: " + reviewId + " and username: " + username);

        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (!reviewOptional.isPresent()) {
            // Nếu không tìm thấy đánh giá, in thông báo lỗi
            System.out.println("Review with ID " + reviewId + " not found.");
            return false;
        }

        if (!userOptional.isPresent()) {
            // Nếu không tìm thấy người dùng, in thông báo lỗi
            System.out.println("User with username " + username + " not found.");
            return false;
        }

        Review review = reviewOptional.get();
        User user = userOptional.get();

        // In thông tin đánh giá và người dùng
        System.out.println("Found review: " + review);
        System.out.println("Found user: " + user);

        if (reviewLikeRepository.existsByReviewIdAndUserId(reviewId, user.getId())) {
            // Nếu người dùng đã thích đánh giá rồi, in thông báo
            System.out.println("User " + username + " has already liked review with ID " + reviewId + ".");
            return false;
        }

        ReviewLike like = new ReviewLike();
        like.setReview(review);
        like.setUser(user);
        reviewLikeRepository.save(like);

        // In thông báo thành công
        System.out.println("Successfully liked review with ID " + reviewId + " by user " + username + ".");
        return true;
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
