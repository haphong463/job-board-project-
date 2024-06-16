package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Util.FileUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
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
        handleImageFile(blog, imageFile, "create");
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
            updateBlogDetails(existingBlog, updatedBlog);
            handleImageFile(existingBlog, imageFile, "update");
            return blogRepository.save(existingBlog);
        } else {
            logger.warning("Blog not found: " + id);
            return null;
        }
    }

    @Override
    public void deleteBlog(Long id) {
        Blog existingBlog = blogRepository.findById(id).orElse(null);
        if (existingBlog != null) {
            deleteImageFile(existingBlog);
            blogRepository.deleteById(id);
        }
    }

    @Override
    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug);
    }



    private void handleImageFile(Blog blog, MultipartFile imageFile, String operationType) {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if ("update".equals(operationType)) {
                    deleteImageFile(blog);
                }
                // Save original image
                Path originalFilePath = FileUtils.saveFile(imageFile, "blog");
                String originalImageUrl = FileUtils.convertToUrl(originalFilePath, "blog");
                blog.setImageUrl(originalImageUrl);
                logger.info("Original image " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + originalImageUrl);

                // Save thumbnail
                int thumbnailWidth = 1200;
                int thumbnailHeight = 800;
                Path thumbnailFilePath = FileUtils.saveResizedImage(imageFile, "blog", thumbnailWidth, thumbnailHeight);
                String thumbnailImageUrl = FileUtils.convertToUrl(thumbnailFilePath, "blog/thumbnail");
                blog.setThumbnailUrl(thumbnailImageUrl);
                logger.info("Thumbnail " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + thumbnailImageUrl);
            } catch (IllegalArgumentException | IOException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }
    }



    private void deleteImageFile(Blog blog) {
        String imageUrl = blog.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String[] urlParts = imageUrl.split("/uploads/");
            if (urlParts.length == 2) {
                String[] pathParts = urlParts[1].split("/");
                String folder = pathParts[0];
                String fileName = pathParts[1];
                boolean fileDeleted = FileUtils.deleteFile(folder, fileName);
                if (!fileDeleted) {
                    logger.warning("Failed to delete the image file: " + fileName);
                }
            }
        }
    }

    private void updateBlogDetails(Blog existingBlog, Blog updatedBlog) {
        existingBlog.setTitle(updatedBlog.getTitle());
        existingBlog.setContent(updatedBlog.getContent());
        existingBlog.setCategory(updatedBlog.getCategory());
        existingBlog.setPublishedAt(updatedBlog.getPublishedAt());
        existingBlog.setStatus(updatedBlog.getStatus());
        existingBlog.setSlug(updatedBlog.getSlug());
        existingBlog.setCitation(updatedBlog.getCitation());
    }
}
