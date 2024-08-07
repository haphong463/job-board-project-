package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Enum.*;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Repository.TrendingSkillRepository;
import com.project4.JobBoardService.Service.*;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;
    private final TrendingSkillRepository trendingSkillRepository;
    private final CategoryService categoryService;
    private final CompanyService companyService;
    private final UserService userService;
    private final TransactionService transactionService;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository, CompanyService companyService, TrendingSkillRepository trendingSkillRepository, CategoryService categoryService, UserService userService, TransactionService transactionService) {
        this.jobRepository = jobRepository;
        this.trendingSkillRepository = trendingSkillRepository;
        this.categoryService = categoryService;
        this.companyService = companyService;
        this.userService = userService;
        this.transactionService = transactionService;
    }

    @Override
    public List<JobDTO> getAllJobs() {
        LocalDate today = LocalDate.now();
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
    public List<JobDTO> getSuperHotJobs() {
        // Get list of hot skills from TrendingSkill
        List<TrendingSkill> trendingSkills = trendingSkillRepository.findAll();
        Set<String> trendingSkillNames = trendingSkills.stream()
                .map(TrendingSkill::getSkillName)
                .collect(Collectors.toSet());

        // Get all jobs from jobRepository
        List<Job> jobs = jobRepository.findAll();

        // Process and filter the job list according to the required conditions
        return jobs.stream()
                .filter(job -> {
                    // Filter jobs by hot skills
                    boolean hasTrendingSkill = job.getCategories().stream()
                            .anyMatch(category -> trendingSkillNames.contains(category.getCategoryName()));
                    // Filter jobs by number of slots
                    boolean hasSufficientSlots = job.getSlot() >= 10;
                    // Filter jobs by offeredSalary
                    boolean hasHighSalary = getSalaryFromString(job.getOfferedSalary()) >= 2000;
                    return hasTrendingSkill || hasSufficientSlots || hasHighSalary;
                })
                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private int getSalaryFromString(String salaryString) {
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(salaryString);

        if (matcher.find()) {
            String numberString = matcher.group();
            try {
                return Integer.parseInt(numberString);
            } catch (NumberFormatException e) {
                // If conversion is not possible, return 0
                return 0;
            }
        }
        // If the number is not found, return 0
        return 0;
    }

    @Override
    public Optional<JobDTO> findJobById(Long jobId) {
        Optional<Job> job = jobRepository.findById(jobId);
        return job.map(this::convertToDto);
    }

    @Override
    public boolean createJob(Long companyId, List<Long> categoryIds, JobDTO jobDTO) {
        Optional<CompanyDTO> companyOptional = companyService.getCompanyById(companyId);

        if (companyOptional.isPresent()) {
            Company company = companyService.convertCompanyToEntity(companyOptional.get());
            Job job = convertJobToEntity(jobDTO);
            job.setCompany(company);

            Set<Category> categories = categoryIds.stream()
                    .map(categoryService::getCategoryById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .map(this::convertCategoryToEntity)
                    .collect(Collectors.toSet());

            job.setCategories(categories);
            jobRepository.save(job);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public JobDTO updateJob(Long jobId, JobDTO jobDTO) {
        Optional<Job> jobOptional = jobRepository.findById(jobId);

        if (jobOptional.isPresent()) {
            Job existingJob = jobOptional.get();
            updateJobFromDto(existingJob, jobDTO);
            jobRepository.save(existingJob);
            return convertToDto(existingJob);
        } else {
            throw new EntityNotFoundException("Job not found with id: " + jobId);
        }
    }

    @Override
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
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
        Set<Category> categories = jobDTO.getCategoryId().stream()
                .map(categoryService::getCategoryById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(this::convertCategoryToEntity)
                .collect(Collectors.toSet());
        job.setCategories(categories);

        Company company = new Company();
        company.setCompanyId(jobDTO.getCompanyId());
        job.setCompany(company);

        return job;
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
        dto.setPosition(job.getPosition() != null ? job.getPosition().getValue() : null);
        dto.setExperience(job.getExperience());
        dto.setQualification(job.getQualification());
        dto.setJobType(job.getJobType() != null ? job.getJobType().getValue() : null);
        dto.setContractType(job.getContractType() != null ? job.getContractType().getValue() : null);
        dto.setBenefit(job.getBenefit());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpire(job.getExpire());
        dto.setSlot(job.getSlot());
        dto.setProfileApproved(job.getProfileApproved());
        dto.setIsSuperHot(job.getIsSuperHot());
        dto.setCategoryId(job.getCategories().stream().map(Category::getCategoryId).collect(Collectors.toList()));
        dto.setCompanyId(job.getCompany().getCompanyId());
        return dto;
    }

    private void updateJobFromDto(Job existingJob, JobDTO jobDTO) {
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

        Set<Category> categories = jobDTO.getCategoryId().stream()
                .map(categoryService::getCategoryById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(this::convertCategoryToEntity)
                .collect(Collectors.toSet());
        existingJob.setCategories(categories);
    }

    private Category convertCategoryToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setCategoryName(categoryDTO.getCategoryName());
        return category;
    }
}
