package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.Category;
import com.project4.JobBoardService.Repository.CategoryRepository;
import com.project4.JobBoardService.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategorybyId(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public void savedCategory(Category category) {
        categoryRepository.save(category);
    }

    @Override
    public void deleteCategorybyId(Long id) {
        categoryRepository.deleteById(id);
    }
}
