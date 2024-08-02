package com.project4.JobBoardService.DTO;

import lombok.Data;

@Data
public class ApplicationDTO {
    private Long id;
    private String employeeName;
    private Long userId;
    private JobDTO jobDTO;
    private CompanyDTO companyDTO;
    private byte[] cvFile;
    private String coverLetter;
}
