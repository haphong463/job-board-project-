package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Service.BlogCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blog-category")
public class BlogCategoryController {

    @Autowired
    private BlogCategoryService blogCategoryService;
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<BlogCategory> createBlogCategory(@RequestBody BlogCategory blogCategory) {
        BlogCategory createdCategory = blogCategoryService.createBlogCategory(blogCategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<BlogCategory> getBlogCategoryById(@PathVariable Long id) {
//        BlogCategory categoryOpt = blogCategoryService.getBlogCategoryById(id);
//        return categoryOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//@PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<BlogCategoryDTO>> getAllBlogCategories() {
        List<BlogCategoryDTO> categories = blogCategoryService.getAllBlogCategories();
        return ResponseEntity.ok(categories);
    }
//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BlogCategory> updateBlogCategory(@PathVariable Long id, @RequestBody BlogCategory updatedCategory) {
        BlogCategory category = blogCategoryService.updateBlogCategory(id, updatedCategory);
        return category != null ? ResponseEntity.ok(category) : ResponseEntity.notFound().build();
    }
//    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogCategory(@PathVariable Long id) {
        blogCategoryService.deleteBlogCategory(id);
        return ResponseEntity.noContent().build();
    }
}