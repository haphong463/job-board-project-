package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CertificateDTO;

import java.util.List;

public interface CertificateService {
    List<CertificateDTO> getCertificatesByUserId(Long userId);
    CertificateDTO createCertificate(CertificateDTO certificateDTO);
    CertificateDTO updateCertificate(Long certificateId, CertificateDTO certificateDTO);
    void deleteCertificate(Long certificateId);
}
