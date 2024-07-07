package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ERole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
    User updateUser(Long id, User user, MultipartFile multipartFile);
    Page<User> getUsersWithUserRole(ERole roleName, String query, Pageable pageable);  // Updated method with Pageable
    User updateUserEnableStatus(Long id, Boolean isEnabled);

}
