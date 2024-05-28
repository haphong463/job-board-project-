package com.project4.JobBoardService.Entity;


import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ROLE_ADMIN,
    ROLE_USER,
    ROLE_EMPLOYER,
    ROLE_MODERATOR;

    @Override
    public String getAuthority() {
        return name();
    }
}