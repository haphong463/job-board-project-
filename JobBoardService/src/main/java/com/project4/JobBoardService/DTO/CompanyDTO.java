package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyDTO {

    private Integer companyId;


    private String companyName;


    private String logo;


    private String websiteLink;


    private String description;


    private BigDecimal rating;


    private String review;


    private String location;
    private String type;


    private Boolean membershipRequired = false;
}
