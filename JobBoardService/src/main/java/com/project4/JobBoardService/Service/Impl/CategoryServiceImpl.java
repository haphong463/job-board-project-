package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.Entity.Category;
import com.project4.JobBoardService.Repository.CategoryRepository;
import com.project4.JobBoardService.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Override

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        // Set other fields as needed
        return dto;
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