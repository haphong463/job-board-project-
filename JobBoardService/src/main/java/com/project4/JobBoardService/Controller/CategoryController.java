package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.Entity.Category;
import com.project4.JobBoardService.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryService.getCategorybyId(id);
    }

    @PostMapping
    public void saveCategory(@RequestBody Category category) {
        categoryService.savedCategory(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategoryById(@PathVariable Long id) {
        categoryService.deleteCategorybyId(id);
    }
}
