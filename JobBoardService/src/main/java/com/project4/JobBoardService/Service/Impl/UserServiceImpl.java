package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
