package com.project4.JobBoardService.Service.Impl;


import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.Util.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(Long id, User user, MultipartFile multipartFile) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            updateUserDetails(existingUser, user);
            handleImageFile(existingUser, multipartFile, "update");
            return userRepository.save(existingUser);
        } else {
            logger.warning("Blog not found: " + id);
            return null;
        }
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }


    private void handleImageFile(User user, MultipartFile imageFile, String operationType) {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if ("update".equals(operationType)) {
                    deleteImageFile(user.getImageUrl());
                    deleteImageFile(user.getThumbnailUrl());
                }
                // Save original image
                Path originalFilePath = FileUtils.saveFile(imageFile, "user");
                String originalImageUrl = FileUtils.convertToUrl(originalFilePath, "user");
                user.setImageUrl(originalImageUrl);
                logger.info("Original image " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + originalImageUrl);

                // Save thumbnail
                int thumbnailWidth = 400;
                int thumbnailHeight = 400;
                Path thumbnailFilePath = FileUtils.saveResizedImage(imageFile, "user", thumbnailWidth, thumbnailHeight);
                String thumbnailImageUrl = FileUtils.convertToUrl(thumbnailFilePath, "user/thumbnail");
                user.setThumbnailUrl(thumbnailImageUrl);
                logger.info("Thumbnail " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + thumbnailImageUrl);
            } catch (IllegalArgumentException | IOException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }
    }

    private void deleteImageFile(String image) {
        if (image != null && !image.isEmpty()) {
            String[] urlParts = image.split("/uploads/");
            if (urlParts.length == 2) {
                String[] pathParts = urlParts[1].split("/");
                String folder = pathParts[0];
                String fileName = pathParts[1];
                if(fileName.equals("thumbnail")){
                    fileName += "/" + pathParts[2];
                }
                boolean fileDeleted = FileUtils.deleteFile(folder, fileName);
                if (!fileDeleted) {
                    logger.warning("Failed to delete the image file: " + fileName);
                }
            }
        }
    }

    private void updateUserDetails(User existingBlog, User updatedBlog) {
        existingBlog.setFirstName(updatedBlog.getFirstName());
        existingBlog.setLastName(updatedBlog.getLastName());
        existingBlog.setGender(updatedBlog.getGender());
        existingBlog.setBio(updatedBlog.getBio());
//        existingBlog.setStatus(updatedBlog.getStatus());
//        existingBlog.setSlug(updatedBlog.getSlug());
//        existingBlog.setCitation(updatedBlog.getCitation());
    }
}
