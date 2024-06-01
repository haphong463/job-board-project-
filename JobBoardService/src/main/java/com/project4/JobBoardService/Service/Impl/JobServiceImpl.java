package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Service.CategoryService;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl   implements JobService {
    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final CategoryService categoryService;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository ,  CompanyService companyService, CategoryService categoryService) {
        this.jobRepository = jobRepository;
        this.companyService = companyService;
        this.categoryService = categoryService;
    }

    @Override
    public List<JobDTO> findAllJobsByCompanyId(Long companyId) {
        List<Job> jobs = jobRepository.findByCompany_CompanyId(companyId);
        return jobs.stream().map(this::convertToDto).collect(Collectors.toList());
    }

  /*  @Override
    public Integer countJobsByCompanyId(Long companyId) {
        return jobRepository.countByCompanyId(companyId);
    }
*/

    @Override
    public boolean createJob(Long companyId, Long categoryId, JobDTO jobDTO) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId);
        Optional<Category> categoryOptional = Optional.ofNullable(categoryService.getCategorybyId(categoryId));

        if (companyOptional.isPresent() && categoryOptional.isPresent()) {
            Company company = companyOptional.get();
            Category category = categoryOptional.get();


            Job job = convertToEntity(jobDTO);


            job.setCompany(company);
            job.setCategory(category);


            jobRepository.save(job);
            return true;
        }
        return false;
    }
    @Override
    public JobDTO updateJob(Long jobId, JobDTO jobDTO) {
        Optional<Job> optionalJob = jobRepository.findById(jobId);
        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();

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
            job.setExperience(jobDTO.getExperience());
            job.setQualification(jobDTO.getQualification());


            job = jobRepository.save(job);
            return convertToDto(job);
        } else {

            return null;
        }
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
        dto.setQualification(job.getQualification());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setCategoryId(job.getCategory().getCategoryId());
        dto.setCompanyId(job.getCompany().getCompanyId());
        return dto;
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
        job.setExperience(jobDTO.getExperience());
        job.setQualification(jobDTO.getQualification());
        job.setCreatedAt(jobDTO.getCreatedAt());

        // Set other fields as needed
        return job;
    }
    

}
