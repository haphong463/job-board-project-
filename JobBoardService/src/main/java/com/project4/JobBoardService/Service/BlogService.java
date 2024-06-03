package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface BlogService {
    List<Blog> getAllBlog();
    Blog createBlog(Blog blog, MultipartFile imageFile) throws IOException;
    Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile);
    Blog getBlogById(Long id);
    void deleteBlog(Long id);
}
