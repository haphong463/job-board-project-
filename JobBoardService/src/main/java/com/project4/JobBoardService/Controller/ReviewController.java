package com.project4.JobBoardService.Controller;

import Project4.JobBoard.Entity.Review;
import Project4.JobBoard.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews(@PathVariable("companyId") Long companyId) {
        return new ResponseEntity<>(reviewService.getAllReviews(companyId), HttpStatus.OK);
    }

    @PostMapping("/reviews")
    public ResponseEntity<String> addReview(@PathVariable("companyId") Long companyId, @RequestBody Review review) {
        boolean isReviewSaved = reviewService.addReview(companyId, review);
        if (isReviewSaved) {
            return new ResponseEntity<>("Review Added Successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Review Not Saved", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> getReview(@PathVariable("companyId") Long companyId, @PathVariable("reviewId") Long reviewId) {
        Review review = reviewService.getReview(companyId, reviewId);
        if (review != null) {
            return new ResponseEntity<>(review, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable("companyId") Long companyId, @PathVariable("reviewId") Long reviewId, @RequestBody Review review) {
        boolean isReviewUpdated = reviewService.updateReview(companyId, reviewId, review);
        if (isReviewUpdated) {
            return new ResponseEntity<>("Review Updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Review not Updated", HttpStatus.NOT_FOUND);
        }
    }
}
