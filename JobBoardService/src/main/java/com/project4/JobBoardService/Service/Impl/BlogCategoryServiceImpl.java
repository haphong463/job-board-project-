package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Repository.BlogCategoryRepository;
import com.project4.JobBoardService.Service.BlogCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogCategoryServiceImpl implements BlogCategoryService {
    @Autowired
    BlogCategoryRepository bcr;

    @Override
    public List<BlogCategory> findAll() {
        return bcr.findAll();
    }
}
