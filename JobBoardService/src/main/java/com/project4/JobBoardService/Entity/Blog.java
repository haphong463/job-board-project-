package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "blog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Blog extends AbstractEntity {
    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "author", nullable = false)
    private String author;


    @ManyToOne
    @JoinColumn(name = "blog_category_id", nullable = false)
    private BlogCategory category;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "published_at")
    private Date publishedAt;

    @Column(name = "status", nullable = false, columnDefinition = "TINYINT")
    private Boolean status;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "slug", unique = true, nullable = false)
    private String slug;
}
