package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.Entity.Category;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO categoryDTO);
    CategoryDTO getCategoryById(Long categoryId);
    List<CategoryDTO> getAllCategories();
    CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO);
    void deleteCategory(Long categoryId);

}
