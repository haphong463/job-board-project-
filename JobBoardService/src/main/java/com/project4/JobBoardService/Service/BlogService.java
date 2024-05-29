package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.Blog;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogService {
    List<Blog> getAllBlog();
    Blog createBlog(Blog blog);
    Blog updateBlog(Long id, Blog blog);
    Blog getBlogById(Long id);
    void deleteBlog(Long id);
}
