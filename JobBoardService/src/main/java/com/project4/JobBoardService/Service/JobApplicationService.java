package com.project4.JobBoardService.Service;
import com.project4.JobBoardService.DTO.JobApplicationDTO;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.JobApplication;
import com.project4.JobBoardService.Repository.JobApplicationRepository;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Repository.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    @Autowired
    private EmailService emailService; //

    @Autowired
    private JobRepository jobRepository; //

    public List<JobApplicationDTO> getApplicationsByCompanyId(Long companyId) {
        List<JobApplication> jobApplications = jobApplicationRepository.findApplicationsByCompanyId(companyId);

        return jobApplications.stream()
                .sorted((ja1, ja2) -> ja2.getCreatedAt().compareTo(ja1.getCreatedAt())) // Sắp xếp theo thời gian từ mới nhất đến cũ nhất
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getApplicationCountByCompany(Long companyId) {
        return jobApplicationRepository.countApplicationsByCompanyId(companyId);
    }
    private JobApplicationDTO convertToDTO(JobApplication jobApplication) {
        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setId(jobApplication.getId());
        dto.setEmployeeName(jobApplication.getEmployeeName());
        dto.setUserId(jobApplication.getUser() != null ? jobApplication.getUser().getId() : null);
        dto.setJobId(jobApplication.getJob() != null ? jobApplication.getJob().getId() : null);
        dto.setCompanyId(jobApplication.getCompany() != null ? jobApplication.getCompany().getCompanyId() : null);
        dto.setCvFile(jobApplication.getCvFile());
        dto.setCoverLetter(jobApplication.getCoverLetter());
        dto.setApproved(jobApplication.isApproved());
        dto.setNew(jobApplication.isNew()); // Thêm dòng này

        if (jobApplication.getJob() != null) {
            dto.setTitle(jobApplication.getJob().getTitle());
            dto.setDescription(jobApplication.getJob().getDescription());
        }


        // Kiểm tra và thêm thông tin người dùng nếu dịch vụ là CVFULL
        if (jobApplication.getUser() != null) {
            Long userId = jobApplication.getUser().getId();
            List<String> services = transactionRepository.findServicesByUserId(userId);
            if (!services.isEmpty() && services.contains("CVFULL")) {
                dto.setEmail(jobApplication.getUser().getEmail());
                dto.setName(jobApplication.getUser().getLastName());
            }
        }

        return dto;
    }

    public List<JobApplicationDTO> getNewApplicationsByCompanyId(Long companyId) {
        List<JobApplication> jobApplications = jobApplicationRepository.findNewApplicationsByCompanyId(companyId);
        return jobApplications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markApplicationAsRead(Long applicationId) {
        jobApplicationRepository.markAsRead(applicationId);
    }


    public Map<String, Object> getChartDataByCompany(Long companyId) {
        List<JobApplication> applications = jobApplicationRepository.findApplicationsByCompanyId(companyId);

        // Phân loại dữ liệu theo tháng hoặc kiểu dữ liệu cần thiết
        // Ví dụ đơn giản: đếm số lượng ứng dụng theo tháng
        Map<String, Long> countByMonth = applications.stream()
                .collect(Collectors.groupingBy(app -> app.getCreatedAt().toLocalDate().getMonth().name(), Collectors.counting()));

        return Map.of(
                "labels", countByMonth.keySet().toArray(new String[0]),
                "dataset1", countByMonth.values().toArray(new Long[0])
        );
    }

    public long getNewCvCountByCompanyId(Long companyId) {
        return jobApplicationRepository.countNewApplicationsByCompanyId(companyId);
    }

    public long getApprovedCvCountByCompanyId(Long companyId) {
        return jobApplicationRepository.countApprovedApplicationsByCompanyId(companyId);
    }


    public void approveJobApplication(Long jobApplicationId) {
        Optional<JobApplication> jobApplicationOpt = jobApplicationRepository.findById(jobApplicationId);
        if (!jobApplicationOpt.isPresent()) {
            throw new IllegalArgumentException("Job application not found");
        }

        JobApplication jobApplication = jobApplicationOpt.get();
        Job job = jobApplication.getJob();
        if (job == null) {
            throw new IllegalArgumentException("Job not found for the application");
        }

        // Tăng profile_approved lên 1
        job.setProfileApproved(job.getProfileApproved() + 1);
        jobRepository.save(job);

        // Gửi email thông báo
        if (jobApplication.getUser() != null && jobApplication.getUser().getEmail() != null) {
            String email = jobApplication.getUser().getEmail();
            String subject = "Your job application has been approved!";
            String messageContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<style>" +
                    "body {" +
                    "    font-family: Arial, sans-serif;" +
                    "    background-color: #f4f4f4;" +
                    "    margin: 0;" +
                    "    padding: 0;" +
                    "}" +
                    ".container {" +
                    "    width: 100%;" +
                    "    padding: 20px;" +
                    "    background-color: #ffffff;" +
                    "    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" +
                    "    margin: 20px auto;" +
                    "    max-width: 600px;" +
                    "}" +
                    ".header {" +
                    "    background-color: #4CAF50;" +
                    "    color: white;" +
                    "    padding: 10px 0;" +
                    "    text-align: center;" +
                    "}" +
                    ".content {" +
                    "    padding: 20px;" +
                    "    text-align: center;" +
                    "}" +
                    ".footer {" +
                    "    background-color: #f1f1f1;" +
                    "    padding: 10px;" +
                    "    text-align: center;" +
                    "    font-size: 12px;" +
                    "    color: #888;" +
                    "}" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>" +
                    "    <div class='header'>" +
                    "        <h1>Application Approved</h1>" +
                    "    </div>" +
                    "    <div class='content'>" +
                    "        <p>Congratulations! Your application for the job <strong>" + job.getTitle() + "</strong> has been approved.</p>" +
                    "    </div>" +
                    "    <div class='footer'>" +
                    "        <p>&copy; 2024 Job Board Service</p>" +
                    "    </div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";
            emailService.sendEmail(email, subject, messageContent);
        }
    }

}