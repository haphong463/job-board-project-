package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class JobType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @ManyToMany(mappedBy = "jobTypes")
    private Set<Job> jobs = new HashSet<>();


}
