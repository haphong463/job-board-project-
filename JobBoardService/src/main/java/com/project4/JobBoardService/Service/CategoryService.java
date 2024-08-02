package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.Entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    public List<CategoryDTO> getAllCategories();
    Category getCategorybyId(Long id);

    void savedCategory(Category category);

    void deleteCategorybyId(Long id);


}
