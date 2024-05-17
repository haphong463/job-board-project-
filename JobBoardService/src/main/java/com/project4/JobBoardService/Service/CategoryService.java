package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategorybyId(Long id);

    void savedCategory(Category category);

    void deleteCategorybyId(Long id);

}
