package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Util.FileUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class BlogServiceImpl implements BlogService {
    private static final Logger logger = Logger.getLogger(BlogService.class.getName());

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Blog createBlog(Blog blog, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                Path filePath = FileUtils.saveFile(imageFile, "blog");
                String imageUrl = FileUtils.convertToUrl(filePath, "blog");
                blog.setImageUrl(imageUrl);
                logger.info("Image saved to: " + imageUrl);
            } catch (IllegalArgumentException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }

        return blogRepository.save(blog);
    }

    @Override
    public List<Blog> getAllBlog() {
        return blogRepository.findAll();
    }

    @Override
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id).orElse(null);
    }


    @Override
    public Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile) {
        Blog existingBlog = blogRepository.findById(id).orElse(null);
        if (existingBlog != null) {
            existingBlog.setTitle(updatedBlog.getTitle());
            existingBlog.setContent(updatedBlog.getContent());
            existingBlog.setAuthor(updatedBlog.getAuthor());
            existingBlog.setCategory(updatedBlog.getCategory());
            existingBlog.setPublishedAt(updatedBlog.getPublishedAt());
            existingBlog.setStatus(updatedBlog.getStatus());
            existingBlog.setSlug(updatedBlog.getSlug());

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    Path filePath = FileUtils.saveFile(imageFile, "blog");
                    String imageUrl = FileUtils.convertToUrl(filePath, "blog");
                    existingBlog.setImageUrl(imageUrl);
                    logger.info("Image updated and saved to: " + filePath.toString());
                } catch (IllegalArgumentException | IOException e) {
                    logger.warning("Invalid file: " + e.getMessage());
                }
            }

            return blogRepository.save(existingBlog);
        } else {
            logger.warning("Blog not found: " + id);
            return null;
        }
    }

    public void deleteBlog(Long id) {
        Blog existingBlog = blogRepository.findById(id).orElse(null);
        if (existingBlog != null) {
            // Assuming the image URL format is something like "http://localhost:8080/uploads/{folder}/{fileName}"
            String imageUrl = existingBlog.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                // Extract the folder and fileName from the URL
                String[] urlParts = imageUrl.split("/uploads/");
                if (urlParts.length == 2) {
                    String[] pathParts = urlParts[1].split("/");
                    String folder = pathParts[0];
                    String fileName = pathParts[1];

                    // Delete the file
                    boolean fileDeleted = FileUtils.deleteFile(folder, fileName);
                    if (!fileDeleted) {
                        System.out.println("Failed to delete the image file: " + fileName);
                    }
                }
            }
            // Delete the blog entry
            blogRepository.deleteById(id);
        }
    }

}