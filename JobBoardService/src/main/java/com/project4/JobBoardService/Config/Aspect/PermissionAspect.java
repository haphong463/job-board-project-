package com.project4.JobBoardService.Config.Aspect;

import com.project4.JobBoardService.Config.Annotation.CheckPermission;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.EPermissions;
import com.project4.JobBoardService.Repository.UserRepository;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private UserRepository userRepository;

    @Before("@annotation(checkPermission)")
    public void checkPermission(CheckPermission checkPermission) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EPermissions requiredPermission = checkPermission.value();
        boolean hasPermission = user.getPermissions().stream().anyMatch(p -> p.getName().equals(requiredPermission.name()));

        if (!hasPermission) {
            throw new RuntimeException("You do not have permission to perform this action");
        }
    }
}
