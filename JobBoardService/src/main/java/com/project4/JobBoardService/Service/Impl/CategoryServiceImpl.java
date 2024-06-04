package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.Entity.Category;
import com.project4.JobBoardService.Repository.CategoryRepository;
import com.project4.JobBoardService.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    private List<CategoryDTO> categories = new ArrayList<>();
    private Long idCounter = 1L;

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        categoryDTO.setCategoryId(idCounter++);
        categories.add(categoryDTO);
        return categoryDTO;
    }

    @Override
    public CategoryDTO getCategoryById(Long categoryId) {
        return categories.stream()
                .filter(category -> category.getCategoryId().equals(categoryId))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return new ArrayList<>(categories);
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        CategoryDTO existingCategory = getCategoryById(categoryId);
        if (existingCategory != null) {
            existingCategory.setCategoryName(categoryDTO.getCategoryName());
        }
        return existingCategory;
    }

    @Override
    public void deleteCategory(Long categoryId) {
        categories.removeIf(category -> category.getCategoryId().equals(categoryId));
    }
}