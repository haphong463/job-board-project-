package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Optional<Company> companyOptional = companyService.getCompanyById(id);
        return companyOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PostMapping("/add")
    public Company createCompany(@RequestBody CompanyDTO companyDTO) {
        return companyService.saveCompany(companyDTO);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody CompanyDTO companyDTO) {
        Company updatedCompany = companyService.updateCompany(id, companyDTO);
        return updatedCompany != null ? ResponseEntity.ok(updatedCompany) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add/{id}/upload-logo")
    public ResponseEntity<String> uploadLogo(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        try {
            String filePath = companyService.uploadLogo(id, file);
            return filePath != null ? ResponseEntity.ok(filePath) : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file");
        }
    }
}