package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class CompanyService {
    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    private static final Logger logger = Logger.getLogger(CompanyService.class.getName());

    private static final String UPLOAD_DIR = "static/images";


    public Company saveCompany(CompanyDTO companyDTO) {
        Company company = new Company();
        company.setCompanyName(companyDTO.getCompanyName());
        company.setWebsiteLink(companyDTO.getWebsiteLink());
        company.setDescription(companyDTO.getDescription());

        company.setLocation(companyDTO.getLocation());
        company.setType(companyDTO.getType());
        company.setMembershipRequired(companyDTO.getMembershipRequired());
        return companyRepository.save(company);
    }

    public Company updateCompany(Long id, CompanyDTO companyDTO) {
        Optional<Company> existingCompany = companyRepository.findById(id);
        if (existingCompany.isPresent()) {
            Company company = existingCompany.get();
            company.setCompanyName(companyDTO.getCompanyName());
            company.setWebsiteLink(companyDTO.getWebsiteLink());
            company.setDescription(companyDTO.getDescription());

            company.setLocation(companyDTO.getLocation());
            company.setType(companyDTO.getType());
            company.setMembershipRequired(companyDTO.getMembershipRequired());
            return companyRepository.save(company);
        } else {
            return null;
        }
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }

    public String uploadLogo(Long id, MultipartFile file) throws IOException {
        Optional<Company> existingCompany = companyRepository.findById(id);
        if (existingCompany.isPresent()) {
            Company company = existingCompany.get();

            // Lấy đường dẫn tuyệt đối của thư mục resources
            Path resourceDirectory = Paths.get("src", "main", "resources", UPLOAD_DIR).toAbsolutePath().normalize();

            // Tạo đường dẫn đến file đích
            String fileName = file.getOriginalFilename();
            Path filePath = resourceDirectory.resolve(fileName);


            if (Files.notExists(resourceDirectory)) {
                Files.createDirectories(resourceDirectory);
            }

            logger.info("Saving file to: " + filePath.toString());

            // Save the file
            Files.copy(file.getInputStream(), filePath);


            company.setLogo(filePath.toString());
            companyRepository.save(company); // Save the updated company

            return filePath.toString();
        } else {
            logger.warning("Company not found: " + id);
            return null;
        }
    }
}