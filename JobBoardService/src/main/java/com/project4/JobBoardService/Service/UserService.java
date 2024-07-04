package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
    User updateUser(Long id, User user, MultipartFile multipartFile);
    List<User> findAll();
}
