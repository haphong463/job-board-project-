package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Integer> {
}
