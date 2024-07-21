package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Enum.*;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Service.*;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class JobServiceImpl   implements JobService {
    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final CategoryService categoryService;
    private final UserService userService;
    private final TransactionService transactionService;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository, CompanyService companyService, CategoryService categoryService, UserService userService,TransactionService transactionService) {
        this.jobRepository = jobRepository;
        this.companyService = companyService;
        this.categoryService = categoryService;
        this.userService = userService;
        this.transactionService=transactionService;
    }

    @Override
    public List<JobDTO> getAllJobs() {
        LocalDate today = LocalDate.now();  // Hoặc LocalDate.now() để lấy ngày hiện tại
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream()
                .filter(job -> {
                    LocalDate expireDate = LocalDate.parse(job.getExpire(), formatter);
                    boolean notExpired = today.isBefore(expireDate);
                    boolean slotsAvailable = job.getProfileApproved() < job.getSlot();
                    return notExpired && slotsAvailable;
                })
                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
                .map(this::convertToDto)
                .collect(Collectors.toList());
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


    public boolean createJob(Long companyId, Long categoryId, JobDTO jobDTO) {
        Long userId = jobDTO.getUserId();

        Optional<User> userOptional = userService.findById(userId);
        Optional<CompanyDTO> companyOptional = companyService.getCompanyById(companyId);
        Optional<Category> categoryOptional = Optional.ofNullable(categoryService.getCategorybyId(categoryId));

        if (userOptional.isPresent() && categoryOptional.isPresent() && companyOptional.isPresent()) {
            User user = userOptional.get();
            Company company = companyService.convertCompanyToEntity(companyOptional.get());
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
            job.setCompany(company);
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
            existingJob.setResponsibilities(jobDTO.getResponsibilities());
            existingJob.setRequiredSkills(jobDTO.getRequiredSkills());
            existingJob.setWorkSchedule(jobDTO.getWorkSchedule());
            existingJob.setKeySkills(jobDTO.getKeySkills());
            existingJob.setPosition(Position.fromString(jobDTO.getPosition()));
            existingJob.setExperience(jobDTO.getExperience());
            existingJob.setQualification(jobDTO.getQualification());
            existingJob.setJobType(JobType.fromString(jobDTO.getJobType()));
            existingJob.setContractType(ContractType.fromString(jobDTO.getContractType()));
            existingJob.setBenefit(jobDTO.getBenefit());
            existingJob.setCreatedAt(jobDTO.getCreatedAt());
            existingJob.setExpire(jobDTO.getExpire());
            existingJob.setSlot(jobDTO.getSlot());
            existingJob.setProfileApproved(jobDTO.getProfileApproved());
            existingJob.setIsSuperHot(jobDTO.getIsSuperHot());


//            existingJob.setKeySkills(jobDTO.getKeySkills());
//            existingJob.setPosition(jobDTO.getPosition());
//            existingJob.setExperience(jobDTO.getExperience());
//            existingJob.setQuantity(jobDTO.getQuantity());
//            existingJob.setQualification(jobDTO.getQualification());

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
        job.setResponsibilities(jobDTO.getResponsibilities());
        job.setRequiredSkills(jobDTO.getRequiredSkills());
        job.setWorkSchedule(jobDTO.getWorkSchedule());
        job.setKeySkills(jobDTO.getKeySkills());
        job.setPosition(Position.fromString(jobDTO.getPosition()));
        job.setExperience(jobDTO.getExperience());
        job.setQualification(jobDTO.getQualification());
        job.setJobType(JobType.fromString(jobDTO.getJobType()));
        job.setContractType(ContractType.fromString(jobDTO.getContractType()));

        job.setBenefit(jobDTO.getBenefit());
        job.setCreatedAt(jobDTO.getCreatedAt());
        job.setExpire(jobDTO.getExpire());
        job.setSlot(jobDTO.getSlot());
        job.setProfileApproved(jobDTO.getProfileApproved());
        job.setIsSuperHot(jobDTO.getIsSuperHot());
        LocalDateTime createdAt = jobDTO.getCreatedAt() != null ? jobDTO.getCreatedAt() : LocalDateTime.now();
        job.setExpired(createdAt.plusDays(7));

        Category category = new Category();
        category.setCategoryId(jobDTO.getCategoryId());
        job.setCategory(category);

        Company company = new Company();
        company.setCompanyId(jobDTO.getCompanyId());
        job.setCompany(company);

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
        dto.setResponsibilities(job.getResponsibilities());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setWorkSchedule(job.getWorkSchedule());
        dto.setKeySkills(job.getKeySkills());
        if (job.getPosition() != null) {
            dto.setPosition(job.getPosition().getValue());
        } else {
            dto.setPosition(null);
        }
        dto.setExperience(job.getExperience());
        dto.setQualification(job.getQualification());
        if (job.getJobType() != null) {
            dto.setJobType(job.getJobType().getValue());
        } else {
            dto.setJobType(null);
        }
        if (job.getContractType() != null) {
            dto.setContractType(job.getContractType().getValue());
        } else {
            dto.setContractType(null);
        }
        dto.setBenefit(job.getBenefit());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpire(job.getExpire());
        dto.setSlot(job.getSlot());
        dto.setProfileApproved(job.getProfileApproved());
        dto.setIsSuperHot(job.getIsSuperHot());
        dto.setCategoryId(job.getCategory().getCategoryId());
        dto.setCompanyId(job.getCompany().getCompanyId());
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

    public Category convertJobToEntity(CategoryDTO categoryDTO) {
        return new Category(categoryDTO.getCategoryId(), categoryDTO.getCategoryName());
    }
}