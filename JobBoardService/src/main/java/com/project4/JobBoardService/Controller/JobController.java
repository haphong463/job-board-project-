package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }
    @GetMapping("/{companyId}")
    public ResponseEntity<List<JobDTO>> getAllJobsByCompanyId(@PathVariable Long companyId) {
        List<JobDTO> jobs = jobService.findAllJobsByCompanyId(companyId);
        if (jobs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jobs);
        }
        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/companies/{companyId}/categories/{categoryId}/jobs")
    public ResponseEntity<Boolean> createJob(@PathVariable("companyId") Long companyId,
                                             @PathVariable("categoryId") Long categoryId,
                                             @RequestBody JobDTO jobDTO) {
        boolean createdJob = jobService.createJob(companyId, categoryId, jobDTO);
        return ResponseEntity.ok(createdJob);
    }
    @PutMapping("/edit/{jobId}")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long jobId, @RequestBody JobDTO jobDTO) {
        JobDTO updatedJob = jobService.updateJob(jobId, jobDTO);
        if (updatedJob != null) {
            return ResponseEntity.ok(updatedJob);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.noContent().build();
    }


}