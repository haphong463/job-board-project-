package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BlogService {
    List<BlogResponseDTO> getAllBlog();
    Blog createBlog(Blog blog, MultipartFile imageFile) throws IOException;
    Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile) throws IOException;
    Blog getBlogById(Long id);
    void deleteBlog(Long id);
    BlogResponseDTO convertToDto(Blog blog);
}
