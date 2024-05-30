package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Util.FileUtils;
import com.project4.JobBoardService.Util.Variables.FileVariables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class BlogServiceImpl implements BlogService {
    private static final Logger logger = Logger.getLogger(BlogService.class.getName());
    private static final String UPLOAD_DIR = "upload/blog_images"; // Đường dẫn tới thư mục upload

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public Blog createBlog(Blog blog, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                Path filePath = FileUtils.saveFile(imageFile);
                String imageUrl = FileUtils.convertToUrl(filePath);
                blog.setImageUrl(imageUrl);
                logger.info("Image saved to: " + imageUrl);
            } catch (IllegalArgumentException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }

        return blogRepository.save(blog);
    }

    @Override
    public Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile) throws IOException {
        return null;
    }

    @Override
    public List<Blog> getAllBlog() {
        return blogRepository.findAll();
    }

    @Override
    public Blog getBlogById(Long id) {
        Optional<Blog> blog = blogRepository.findById(id);
        return blog.orElse(null);
    }

//    @Override
//    public Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile) throws IOException {
//        Optional<Blog> existingBlogOpt = blogRepository.findById(id);
//        if (existingBlogOpt.isPresent()) {
//            Blog existingBlog = existingBlogOpt.get();
//            existingBlog.setTitle(updatedBlog.getTitle());
//            existingBlog.setContent(updatedBlog.getContent());
//            existingBlog.setAuthor(updatedBlog.getAuthor());
//            existingBlog.setCategory(updatedBlog.getCategory());
//            existingBlog.setPublishedAt(updatedBlog.getPublishedAt());
//            existingBlog.setStatus(updatedBlog.getStatus());
//            existingBlog.setSlug(updatedBlog.getSlug());
//
//            if (imageFile != null && !imageFile.isEmpty()) {
//                try {
//                    Path filePath = FileUtils.saveFile(UPLOAD_DIR, imageFile);
//                    existingBlog.setImageUrl(filePath.toString());
//                    logger.info("Image updated and saved to: " + filePath.toString());
//                } catch (IllegalArgumentException e) {
//                    logger.warning("Invalid file: " + e.getMessage());
//                }
//            }
//
//            return blogRepository.save(existingBlog);
//        } else {
//            logger.warning("Blog not found: " + id);
//            return null;
//        }
//    }

    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }

    public BlogResponseDTO convertToDto(Blog blog) {
        BlogResponseDTO dto = new BlogResponseDTO();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setAuthor(blog.getAuthor());

        BlogResponseDTO.BlogCategoryDTO categoryDTO = new BlogResponseDTO.BlogCategoryDTO();
        categoryDTO.setId(blog.getCategory().getId());
        categoryDTO.setName(blog.getCategory().getName());

        dto.setCategory(categoryDTO);

        return dto;
    }
}
