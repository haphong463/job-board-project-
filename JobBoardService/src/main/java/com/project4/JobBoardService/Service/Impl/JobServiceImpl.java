package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Enum.WorkSchedule;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl   implements JobService {
    private final JobRepository jobRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final TransactionService transactionService;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository , CompanyService companyService, CategoryService categoryService, UserService userService,TransactionService transactionService) {
        this.jobRepository = jobRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        this.transactionService=transactionService;
    }

    @Override
    public List<JobDTO> findAllJobsByCompanyId(Long userId) {
        List<Job> jobs = jobRepository.findAllByUserId(userId);
        return jobs.stream().map(this::convertToDto).collect(Collectors.toList());
    }


    public List<JobDTO> searchJobsByCompanyId(Long userId, String query) {
        List<Job> jobs = jobRepository.findByUser_IdAndTitleContaining(userId, query);
        return jobs.stream().map(this::convertToDto).collect(Collectors.toList());
    }


    public List<JobDTO> filterJobsByExpirationStatus(Long userId, boolean isExpired) {
        LocalDate currentDate = LocalDate.now();
        if (isExpired) {
            List<Job> expiredJobs = jobRepository.findByUser_IdAndExpiredBefore(userId, currentDate);
            return expiredJobs.stream().map(this::convertToDto).collect(Collectors.toList());
        } else {
            List<Job> activeJobs = jobRepository.findByUser_IdAndExpiredAfter(userId, currentDate);
            return activeJobs.stream().map(this::convertToDto).collect(Collectors.toList());
        }
    }

    @Override
    public Optional<JobDTO> findJobById(Long jobId) {
        Optional<Job> job = jobRepository.findById(jobId);
        return job.map(this::convertToDto);
    }
  /*  @Override
    public Integer countJobsByCompanyId(Long companyId) {
        return jobRepository.countByCompanyId(companyId);
    }
*/
  public boolean createJob(Long userId, Long categoryId, JobDTO jobDTO) {
      Optional<User> userOptional = userService.findById(userId);
      Optional<Category> categoryOptional = Optional.ofNullable(categoryService.getCategorybyId(categoryId));

      if (userOptional.isPresent() && categoryOptional.isPresent()) {
          User user = userOptional.get();
          Category category = categoryOptional.get();

          int jobCountThisMonth = jobRepository.countJobsByUserIdAndMonth(userId, LocalDate.now().getYear(), LocalDate.now().getMonthValue());


          Optional<Subscription> subscriptionOptional = transactionService.findActiveSubscriptionByUser(user, LocalDate.now());
          int maxPosts = subscriptionOptional.map(Subscription::getPostLimit).orElse(10); // 10 nếu không có subscription

          if (jobCountThisMonth >= maxPosts) {
              return false;
          }

          // Tạo đối tượng Job từ DTO
          Job job = convertJobToEntity(jobDTO);
          job.setUser(user);
          job.setCategory(category);

          // Lưu job vào repository
          jobRepository.save(job);
          return true;
      } else {
          return false;
      }
  }


    public JobDTO updateJob(Long jobId, JobDTO jobDTO) {
        Optional<Job> jobOptional = jobRepository.findById(jobId);

        if (jobOptional.isPresent()) {
            Job existingJob = jobOptional.get();

            // Cập nhật các thuộc tính từ JobDTO vào existingJob
            existingJob.setTitle(jobDTO.getTitle());
            existingJob.setOfferedSalary(jobDTO.getOfferedSalary());
            existingJob.setDescription(jobDTO.getDescription());
            existingJob.setCity(jobDTO.getCity());
            existingJob.setResponsibilities(jobDTO.getResponsibilities());
            existingJob.setRequiredSkills(jobDTO.getRequiredSkills());
            existingJob.setWorkSchedule(WorkSchedule.FULL_TIME);
            existingJob.setWorkSchedule(WorkSchedule.PART_TIME);
            existingJob.setWorkSchedule(WorkSchedule.FREELANCE);
            existingJob.setWorkSchedule(WorkSchedule.INTERNSHIP);
            existingJob.setKeySkills(jobDTO.getKeySkills());
            existingJob.setPosition(jobDTO.getPosition());
            existingJob.setExperience(jobDTO.getExperience());
            existingJob.setQuantity(jobDTO.getQuantity());
            existingJob.setQualification(jobDTO.getQualification());
//            existingJob.setCategoryId(jobDTO.getCategoryId());

            // Lưu lại công việc đã cập nhật vào cơ sở dữ liệu
            jobRepository.save(existingJob);

            // Chuyển đổi từ Job entity sang JobDTO để trả về
            return convertToDto(existingJob);
        } else {
            throw new EntityNotFoundException("Job not found with id: " + jobId);
        }

    }

    private Job convertJobToEntity(JobDTO jobDTO) {
        Job job = new Job();
        job.setTitle(jobDTO.getTitle());
        job.setOfferedSalary(jobDTO.getOfferedSalary());
        job.setDescription(jobDTO.getDescription());
        job.setCity(jobDTO.getCity());
        job.setResponsibilities(jobDTO.getResponsibilities());
        job.setRequiredSkills(jobDTO.getRequiredSkills());
        job.setWorkSchedule(WorkSchedule.FULL_TIME);
        job.setWorkSchedule(WorkSchedule.PART_TIME);
        job.setWorkSchedule(WorkSchedule.FREELANCE);
        job.setWorkSchedule(WorkSchedule.INTERNSHIP);
        job.setKeySkills(jobDTO.getKeySkills());
        job.setQuantity(jobDTO.getQuantity());
        job.setPosition(jobDTO.getPosition());
        job.setExperience(jobDTO.getExperience());
        job.setQualification(jobDTO.getQualification());
        job.setCreatedAt(jobDTO.getCreatedAt());
        LocalDateTime createdAt = jobDTO.getCreatedAt() != null ? jobDTO.getCreatedAt() : LocalDateTime.now();
        job.setExpired(createdAt.plusDays(7));
        return job;
    }

    @Override
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }





    private JobDTO convertToDto(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setOfferedSalary(job.getOfferedSalary());
        dto.setDescription(job.getDescription());
        dto.setCity(job.getCity());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setWorkSchedule(String.valueOf(WorkSchedule.FULL_TIME));
        dto.setWorkSchedule(String.valueOf(WorkSchedule.PART_TIME));
        dto.setWorkSchedule(String.valueOf(WorkSchedule.FREELANCE));
        dto.setWorkSchedule(String.valueOf(WorkSchedule.INTERNSHIP));
        dto.setKeySkills(job.getKeySkills());
        dto.setPosition(job.getPosition());
        dto.setExperience(job.getExperience());
        dto.setQuantity(job.getQuantity());
        dto.setQualification(job.getQualification());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setCategoryId(job.getCategory().getCategoryId());
        dto.setUserId(job.getUser().getId());
        dto.setExpired(job.getExpired());
        return dto;
    }
    private Category convertCategoryToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setCategoryName(categoryDTO.getCategoryName());
        // Set other fields if necessary
        return category;
    }
    private Job convertToEntity(JobDTO jobDTO) {
        Job job = new Job();
        job.setId(jobDTO.getId());
        job.setTitle(jobDTO.getTitle());
        job.setOfferedSalary(jobDTO.getOfferedSalary());
        job.setDescription(jobDTO.getDescription());
        job.setCity(jobDTO.getCity());
        job.setResponsibilities(jobDTO.getResponsibilities());
        job.setRequiredSkills(jobDTO.getRequiredSkills());
        job.setWorkSchedule(WorkSchedule.FULL_TIME);
        job.setWorkSchedule(WorkSchedule.PART_TIME);
        job.setWorkSchedule(WorkSchedule.FREELANCE);
        job.setWorkSchedule(WorkSchedule.INTERNSHIP);
        job.setKeySkills(jobDTO.getKeySkills());
        job.setPosition(jobDTO.getPosition());
        job.setQuantity(job.getQuantity());
        job.setExperience(jobDTO.getExperience());
        job.setQualification(jobDTO.getQualification());
        job.setCreatedAt(jobDTO.getCreatedAt());
        job.setExpired(jobDTO.getExpired());

        // Set other fields as needed
        return job;
    }
    public Category convertToEntity(CategoryDTO categoryDTO) {
        return new Category(categoryDTO.getCategoryId(), categoryDTO.getCategoryName());
    }

}
