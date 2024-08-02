package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long categoryId;

    @Column(name = "category_name")
    private String categoryName;

    // Constructor để phù hợp với chuyển đổi từ DTO
    public Category(Long categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<Job> jobs;

}
