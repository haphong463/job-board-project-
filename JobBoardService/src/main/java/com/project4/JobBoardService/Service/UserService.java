package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
}
