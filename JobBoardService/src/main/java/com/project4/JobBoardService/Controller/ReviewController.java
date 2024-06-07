package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies/{companyId}/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping()
    public ResponseEntity<List<Review>> getAllReviews(@PathVariable("companyId") Long companyId) {
        return new ResponseEntity<>(reviewService.getAllReviews(companyId), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping()
    public ResponseEntity<?> addReview(@PathVariable Long companyId,
                                       @RequestBody Review review,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        boolean success = reviewService.addReview(companyId, username, review);
        if (success) {
            return ResponseEntity.ok("Review added successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to add review. Company or user not found.");
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReview(@PathVariable Long companyId,
                                       @PathVariable Long reviewId,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        Review review = reviewService.getReview(companyId, reviewId, username);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.badRequest().body("Review not found.");
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long companyId,
                                          @PathVariable Long reviewId,
                                          @RequestBody Review updatedReview,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        boolean success = reviewService.updateReview( companyId,  reviewId,  username,  updatedReview);
        if (success) {
            return ResponseEntity.ok("Review updated successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to update review. Company or user not found.");
        }
    }
}
