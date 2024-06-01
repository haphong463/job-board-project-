package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

}
