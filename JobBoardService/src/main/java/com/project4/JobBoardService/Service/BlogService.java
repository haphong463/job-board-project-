package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface BlogService {
    List<Blog> getAllBlog();
    Blog createBlog(Blog blog, MultipartFile imageFile, List<String> hashtagNames);
    Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile, List<String> hashtagNames);
    Blog getBlogById(Long id);
    void deleteBlog(Long id);
    Blog getBlogBySlug(String slug);
    Page<Blog> searchBlogs(String query, String type, Pageable pageable, Boolean visibility);//    int getCommentCount();


}
