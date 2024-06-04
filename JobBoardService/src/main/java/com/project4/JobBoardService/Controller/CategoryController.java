package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        return categoryService.createCategory(categoryDTO);
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/{categoryId}")
    public CategoryDTO getCategoryById(@PathVariable Long categoryId) {
        return categoryService.getCategoryById(categoryId);
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{categoryId}")
    public CategoryDTO updateCategory(@PathVariable Long categoryId, @RequestBody CategoryDTO categoryDTO) {
        return categoryService.updateCategory(categoryId, categoryDTO);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
    }
}

