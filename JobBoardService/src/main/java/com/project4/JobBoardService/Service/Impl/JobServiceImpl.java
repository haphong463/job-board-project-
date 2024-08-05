package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Config.ResourceNotFoundException;
import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Enum.Position;
import com.project4.JobBoardService.Enum.WorkSchedule;
import com.project4.JobBoardService.Repository.CategoryRepository;
import com.project4.JobBoardService.Repository.CompanyRepository;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Repository.TransactionRepository;
import com.project4.JobBoardService.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl   implements JobService {
    private final JobRepository jobRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final TransactionService transactionService;
    private  final CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    @Autowired
    public JobServiceImpl(JobRepository jobRepository , CompanyService companyService, CategoryService categoryService, UserService userService, TransactionService transactionService, CategoryRepository categoryRepository) {
        this.jobRepository = jobRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        this.transactionService=transactionService;
        this.categoryRepository = categoryRepository;
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

    @Override
    public int countJobsForUserInMonth(Long userId, int year, int month) {
        return jobRepository.countJobsByUserIdAndMonth(userId, year, month);
    }

    @Override
    public int countJobsForUserInCurrentMonth(Long userId) {
        return jobRepository.countJobsForUserInCurrentMonth(userId);
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
    public boolean createJob(Long userId, JobDTO jobDTO) {
        Optional<User> userOptional = userService.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            int jobCountThisMonth = jobRepository.countJobsByUserIdAndMonth(userId, LocalDate.now().getYear(), LocalDate.now().getMonthValue());

            // Lấy Subscription hiện tại của người dùng
            Optional<Subscription> subscriptionOptional = transactionService.findActiveSubscriptionByUser(user, LocalDate.now());

            System.out.println(subscriptionOptional);

            // Xác định số lượng bài đăng tối đa dựa trên Subscription
            int maxPosts = subscriptionOptional.map(Subscription::getPostLimit).orElse(10); // 10 nếu không có subscription

            if (jobCountThisMonth >= maxPosts) {
                return false;
            }

            List<String> services = transactionRepository.findServicesByUserId(userId);

// Xác định isSuperHot dựa trên dịch vụ
            boolean isSuperHot = services.contains("HOT");

            // Lấy các Category từ danh sách categoryIds
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : jobDTO.getCategoryIds()) {
                categoryRepository.findById(categoryId).ifPresent(categories::add);
            }

            // Tạo đối tượng Job từ DTO
            Job job = convertJobToEntity(jobDTO, categories,isSuperHot);
            job.setUser(user); // Thiết lập User cho Job
            job.setSuperHot(isSuperHot); // Thiết lập isSuperHot

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
            // Retrieve the Company entity based on companyId

            // Cập nhật các thuộc tính từ JobDTO vào existingJob
            existingJob.setTitle(jobDTO.getTitle());
            existingJob.setOfferedSalary(jobDTO.getOfferedSalary());
            existingJob.setDescription(jobDTO.getDescription());
            existingJob.setCity(jobDTO.getCity());
            existingJob.setResponsibilities(jobDTO.getResponsibilities());
            existingJob.setBenefit(jobDTO.getBenefit());
            existingJob.setRequiredSkills(jobDTO.getRequiredSkills());
            existingJob.setWorkSchedule(jobDTO.getWorkSchedule());

            existingJob.setPosition(Position.INTERN);
            existingJob.setPosition(Position.FRESHER);
            existingJob.setPosition(Position.MIDDLE);
            existingJob.setPosition(Position.JUNIOR);
            existingJob.setPosition(Position.LEADER);
            existingJob.setPosition(Position.SENIOR);
            existingJob.setPosition(Position.MANAGER);
            existingJob.setExperience(jobDTO.getExperience());
            existingJob.setSlot(jobDTO.getSlot());
            existingJob.setIsHidden(jobDTO.getIsHidden());
            existingJob.setExpire(jobDTO.getExpire());

            existingJob.setBenefit(jobDTO.getBenefit());
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

    private Job convertJobToEntity(JobDTO jobDTO, Set<Category> categories, boolean isSuperHot) {
        Job job = new Job();

        job.setTitle(jobDTO.getTitle());
        job.setOfferedSalary(jobDTO.getOfferedSalary());
        job.setDescription(jobDTO.getDescription());
        job.setCity(jobDTO.getCity());
        job.setResponsibilities(jobDTO.getResponsibilities());
        job.setRequiredSkills(jobDTO.getRequiredSkills());
        job.setWorkSchedule(jobDTO.getWorkSchedule());
        job.setBenefit(jobDTO.getBenefit());
        job.setSlot(jobDTO.getSlot());
        job.setPosition(Position.INTERN);
        job.setPosition(Position.FRESHER);
        job.setPosition(Position.JUNIOR);
        job.setPosition(Position.MIDDLE);
        job.setPosition(Position.MANAGER);
        job.setPosition(Position.SENIOR);
        job.setExperience(jobDTO.getExperience());
        if (jobDTO.getCompanyId() != null) {
            Company company = new Company();
            company.setCompanyId(jobDTO.getCompanyId());
            job.setCompany(company);
        }


        job.setCategories(categories);
        job.setQualification(jobDTO.getQualification());
        job.setIsHidden(jobDTO.getIsHidden());
        job.setExpire(jobDTO.getExpire());
        job.setCreatedAt(jobDTO.getCreatedAt());
        LocalDateTime createdAt = jobDTO.getCreatedAt() != null ? jobDTO.getCreatedAt() : LocalDateTime.now();
        job.setExpired(createdAt.plusDays(7));
        job.setSuperHot(isSuperHot); // Thiết lập isSuperHot
        return job;
    }

    @Override
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }

    @Override
    public void hideJob(long jobId) {
        Job job = null;
        try {
            job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        } catch (ResourceNotFoundException e) {
            throw new RuntimeException(e);
        }

        // Toggle the isHidden state
        job.setIsHidden(!job.getIsHidden());

        jobRepository.save(job);
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
        dto.setWorkSchedule(job.getWorkSchedule());
        dto.setBenefit(job.getBenefit());
        dto.setPosition(String.valueOf(Position.INTERN));
        dto.setPosition(String.valueOf(Position.FRESHER));
        dto.setPosition(String.valueOf(Position.JUNIOR));
        dto.setPosition(String.valueOf(Position.LEADER));
        dto.setPosition(String.valueOf(Position.MIDDLE));
        dto.setPosition(String.valueOf(Position.MANAGER));
        dto.setPosition(String.valueOf(Position.SENIOR));
        dto.setExperience(job.getExperience());
        dto.setSlot(job.getSlot());
        dto.setIsHidden(job.getIsHidden());
        dto.setIsSuperHot(job.isSuperHot());
        dto.setQualification(job.getQualification());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpire(job.getExpire());
        List<Long> categoryIds = job.getCategories().stream().map(Category::getCategoryId).collect(Collectors.toList());
        dto.setCategoryIds(categoryIds);
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
        job.setWorkSchedule(jobDTO.getWorkSchedule());
        job.setPosition(Position.INTERN);
        job.setPosition(Position.FRESHER);
        job.setPosition(Position.JUNIOR);
        job.setPosition(Position.SENIOR);
        job.setPosition(Position.MIDDLE);
        job.setPosition(Position.MANAGER);
        job.setSlot(jobDTO.getSlot());
        job.setExperience(jobDTO.getExperience());
        job.setQualification(jobDTO.getQualification());
        job.setCreatedAt(jobDTO.getCreatedAt());
        job.setExpired(jobDTO.getExpired());
        job.setExpire(jobDTO.getExpire());

        // Set other fields as needed
        return job;
    }
    public Category convertToEntity(CategoryDTO categoryDTO) {
        return new Category(categoryDTO.getCategoryId(), categoryDTO.getCategoryName());
    }

}