package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    long countByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    int countByCategory(BlogCategory blogCategory);
    Blog findBySlug(@Param("slug") String slug);
    int countByComments(Comment comment);
}


