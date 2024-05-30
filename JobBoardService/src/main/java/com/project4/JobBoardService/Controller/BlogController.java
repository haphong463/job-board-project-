package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    // Create a new blog
    @PostMapping
    public Blog createBlog(@RequestBody Blog blog,
                           @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        System.out.println(blog.getTitle());
        return blog;
//        return blogService.createBlog(blog, imageFile);
    }

    // Get all blogs
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlog();
    }

    // Get a single blog by ID
    @GetMapping("/{id}")
    public Blog getBlogById(@PathVariable Long id) {
        return blogService.getBlogById(id);
    }

    // Update a blog
    @PutMapping("/{id}")
    public Blog updateBlog(@PathVariable Long id,
                           @RequestParam("blog") Blog blog,
                           @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        return blogService.updateBlog(id, blog, imageFile);
    }

    // Delete a blog
    @DeleteMapping("/{id}")
    public void deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
    }
}
