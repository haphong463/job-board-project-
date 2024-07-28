package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    long countByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    int countByCategories(BlogCategory blogCategory);
    Blog findBySlug(@Param("slug") String slug);
    int countByComments(Comment comment);

    @Query("SELECT DISTINCT b FROM Blog b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.hashtags h " +
            "WHERE (:type IS NULL OR c.name = :type) " +
            "AND (LOWER(b.title) LIKE %:query% " +
            "OR LOWER(b.content) LIKE %:query% " +
            "OR LOWER(c.name) LIKE %:query% " +
            "OR LOWER(h.name) LIKE %:query%) " +
            "AND (:visibility IS NULL OR b.visibility = :visibility)")
    Page<Blog> searchByQuery(@Param("type") String type,
                             @Param("query") String query,
                             @Param("visibility") Boolean visibility,
                             Pageable pageable);
}


