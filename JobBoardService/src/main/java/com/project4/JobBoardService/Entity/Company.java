package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    @Column(name = "company_name", length = 100, nullable = false)
    private String companyName;

    @Column(length = 255)
    private String logo;

    @Column(name = "website_link", length = 255)
    private String websiteLink;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(length = 100)
    private String location;

    @Column(length = 50)
    private String type;

    @Column(name = "membership_required", nullable = false)
    private Boolean membershipRequired = false;
    @OneToMany(mappedBy = "company")
    private List<Review> reviews;
}
