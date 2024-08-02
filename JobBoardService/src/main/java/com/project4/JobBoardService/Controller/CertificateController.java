package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CertificateDTO;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.CertificateService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<List<CertificateDTO>> getCertificatesByUserId(@PathVariable Long userId) {
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<CertificateDTO> certificates = certificateService.getCertificatesByUserId(user.getId());
        return ResponseEntity.ok(certificates);
    }





    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<CertificateDTO> createCertificate(@RequestBody CertificateDTO certificateDTO,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        certificateDTO.setUserId(user.getId());
        CertificateDTO createdCertificate = certificateService.createCertificate(certificateDTO);
        return ResponseEntity.ok(createdCertificate);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<CertificateDTO> updateCertificate(@PathVariable Long id,
                                                            @RequestBody CertificateDTO certificateDTO) {
        CertificateDTO updatedCertificate = certificateService.updateCertificate(id, certificateDTO);
        return ResponseEntity.ok(updatedCertificate);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
}