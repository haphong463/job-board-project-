package Project4.JobBoard.Service;

import Project4.JobBoard.DTO.CompanyDTO;
import Project4.JobBoard.Entity.Company;
import Project4.JobBoard.Repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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

    private static final String UPLOAD_DIR = "C:\\APTECH\\IASF\\job-board-project--main\\job-board-project--main\\JobBoardService\\src\\main\\resources\\static\\image";

    public Company saveCompany(CompanyDTO companyDTO) {
        Company company = new Company();
        company.setCompanyName(companyDTO.getCompanyName());
        company.setWebsiteLink(companyDTO.getWebsiteLink());
        company.setDescription(companyDTO.getDescription());
        company.setRating(companyDTO.getRating());
        company.setReview(companyDTO.getReview());
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
            company.setRating(companyDTO.getRating());
            company.setReview(companyDTO.getReview());
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
            String filePath = UPLOAD_DIR + File.separator + file.getOriginalFilename();
            File destFile = new File(filePath);

            // Ensure the directory exists
            File uploadDirFile = new File(UPLOAD_DIR);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            logger.info("Saving file to: " + filePath);
            file.transferTo(destFile); // Save the file

            company.setLogo(filePath); // Update the company logo path
            companyRepository.save(company); // Save the updated company

            return filePath;
        } else {
            logger.warning("Company not found: " + id);
            return null;
        }
    }
}
