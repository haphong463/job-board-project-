package com.project4.JobBoardService.Service.Impl;

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

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, CompanyService companyService, UserRepository userRepository, ModelMapper modelMapper) {
        this.reviewRepository = reviewRepository;
        this.companyService = companyService;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ReviewDTO> getAllReviews(Long companyId) {
        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean addReview(Long companyId, ReviewDTO reviewDTO) {
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

            reviewRepository.save(review);

            return true;
        }
        return false;
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
    public boolean updateReview(Long companyId, Long reviewId, ReviewDTO updatedReviewDTO) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId).map(this::convertCompanyToEntity);
        Optional<User> userOptional = userRepository.findByUsername(updatedReviewDTO.getUsername());

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            Company company = companyOptional.get();
            User user = userOptional.get();

            Review updatedReview = reviewRepository.findById(reviewId).orElse(null);

            if (updatedReview != null) {
                updatedReview.setTitle(updatedReviewDTO.getTitle());
                updatedReview.setDescription(updatedReviewDTO.getDescription());
                updatedReview.setRating(updatedReviewDTO.getRating());
                updatedReview.setCompany(company);
                updatedReview.setUser(user);

                reviewRepository.save(updatedReview);

                return true;
            }
        }
        return false;
    }

    @Override
    public boolean deleteReview(Long companyId, Long reviewId, String username) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId)
                .map(this::convertCompanyToEntity);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            User user = userOptional.get();
            Optional<Review> reviewOptional = reviewRepository.findById(reviewId);

            if (reviewOptional.isPresent()) {
                Review review = reviewOptional.get();
                System.out.println("Review found: " + review);
                if (review.getCompany().getCompanyId().equals(companyId) && review.getUser().equals(user)) {
                    reviewRepository.delete(review);
                    return true;
                } else {
                    System.out.println("Review does not belong to the user.");
                }
            } else {
                System.out.println("Review not found.");
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
        reviewDTO.setImageUrl(review.getUser().getImageUrl()); // Ensure this is set from the User entity
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
