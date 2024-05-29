package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    @Query("SELECT b FROM Blog b WHERE b.title = :title AND b.author = :author")
    List<Blog> findByTitleAndAuthor(@Param("title") String title, @Param("author") String author);

    @Query("SELECT COUNT(b) FROM Blog b WHERE b.author = :author")
    long countByAuthor(@Param("author") String author);
}
