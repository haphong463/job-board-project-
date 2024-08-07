package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.Entity.Category;
import com.project4.JobBoardService.Entity.FavoriteJob;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.FavoriteJobRepository;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorite-jobs")
public class FavoriteJobController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FavoriteJobRepository favoriteJobRepository;
    @Autowired
    private JobRepository jobRepository;
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<?> addJobToFavorites(@RequestBody Map<String, Long> requestBody,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        Long jobId = requestBody.get("jobId");

        Optional<Job> optionalJob = jobRepository.findById(jobId);
        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();

            Optional<User> optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                FavoriteJob favoriteJob = new FavoriteJob();
                favoriteJob.setJob(job);
                favoriteJob.setUser(user);
                favoriteJobRepository.save(favoriteJob);
                Map<String, Object> response = new HashMap<>();
                response.put("favoriteId", favoriteJob.getId());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("User not found!");
            }
        } else {
            return ResponseEntity.badRequest().body("Job not found!");
        }
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/list")
    public ResponseEntity<?> getFavoriteJobsForUser(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            List<FavoriteJob> favoriteJobs = favoriteJobRepository.findByUser(user);

            List<Map<String, Object>> responseList = new ArrayList<>();

            for (FavoriteJob favoriteJob : favoriteJobs) {
                Map<String, Object> responseItem = new HashMap<>();
                responseItem.put("favoriteId", favoriteJob.getId());
                responseItem.put("createdAt", favoriteJob.getJob().getCreatedAt());
                responseItem.put("jobId", favoriteJob.getJob().getId());
                responseItem.put("companyId", favoriteJob.getJob().getCompany().getCompanyId());
                responseItem.put("companyLogo", favoriteJob.getJob().getCompany().getLogo());
                responseItem.put("jobTitle", favoriteJob.getJob().getTitle());
                responseItem.put("offeredSalary", favoriteJob.getJob().getOfferedSalary());
                responseItem.put("jobDescription", favoriteJob.getJob().getDescription());
                responseItem.put("responsibilities", favoriteJob.getJob().getResponsibilities());
                responseItem.put("requiredSkills", favoriteJob.getJob().getRequiredSkills());
                responseItem.put("workSchedule", favoriteJob.getJob().getWorkSchedule());
                responseItem.put("experience", favoriteJob.getJob().getExperience());
                responseItem.put("qualification", favoriteJob.getJob().getQualification());
                responseItem.put("jobType", favoriteJob.getJob().getJobType());
                responseItem.put("contractType", favoriteJob.getJob().getContractType());
                responseItem.put("benefit", favoriteJob.getJob().getBenefit());
                responseItem.put("slot", favoriteJob.getJob().getSlot());
                responseItem.put("expire", favoriteJob.getJob().getExpire());
                responseItem.put("position", favoriteJob.getJob().getPosition());
                responseItem.put("location", favoriteJob.getJob().getCompany().getLocation());
                responseItem.put("categoryId", favoriteJob.getJob().getCategories().stream()
                        .map(Category::getCategoryId)
                        .collect(Collectors.toList()));
                responseItem.put("companyName", favoriteJob.getJob().getCompany().getCompanyName());
                responseItem.put("websiteLink", favoriteJob.getJob().getCompany().getWebsiteLink());
                responseItem.put("companyDescription", favoriteJob.getJob().getCompany().getDescription());
                responseItem.put("keySkills", favoriteJob.getJob().getCompany().getKeySkills());
                responseItem.put("type", favoriteJob.getJob().getCompany().getType());
                responseItem.put("companySize", favoriteJob.getJob().getCompany().getCompanySize());
                responseItem.put("country", favoriteJob.getJob().getCompany().getCountry());
                responseItem.put("countryCode", favoriteJob.getJob().getCompany().getCountryCode());
                responseItem.put("workingDays", favoriteJob.getJob().getCompany().getWorkingDays());

                responseItem.put("username", favoriteJob.getUser().getUsername());
                responseList.add(responseItem);
            }
            return ResponseEntity.ok(responseList);
        } else {
            return ResponseEntity.badRequest().body("User not found!");
        }
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @DeleteMapping("/delete/{favoriteId}")
    public ResponseEntity<?> deleteFavoriteJob(@PathVariable Long favoriteId) {
        Optional<FavoriteJob> optionalFavoriteJob = favoriteJobRepository.findById(favoriteId);
        if (optionalFavoriteJob.isPresent()) {
            favoriteJobRepository.deleteById(favoriteId);
            return ResponseEntity.ok("Favorite job deleted successfully!");
        } else {
            return ResponseEntity.badRequest().body("Favorite job not found!");
        }
    }
}