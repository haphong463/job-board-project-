package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.BlogCategoryService;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;
    @Autowired
    private BlogCategoryService blogCategoryService;
    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @PreAuthorize(" hasRole('ROLE_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(@ModelAttribute BlogDTO blogDTO) {
        BlogCategory category = blogCategoryService.getBlogCategoryById(blogDTO.getBlogCategoryId());
        if (category == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Category not found
        }
        User user = userService.findByUsername(blogDTO.getUsername()).orElse(null);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Category not found
        }
        long todayPostCount = blogService.countTodayPostsByUser(user);
        if(todayPostCount >= 3){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Blog blog = new Blog();

        blog.setTitle(blogDTO.getTitle());
        blog.setContent(blogDTO.getContent());

        blog.setCategory(category);
        blog.setStatus(blogDTO.getStatus());
        blog.setSlug(blogDTO.getSlug());
        blog.setUser(user);
        //



        // Call a method in your service to handle the blog creation logic, including image processing if necessary
        try {
            Blog createdBlog = blogService.createBlog(blog, blogDTO.getImage());
            BlogResponseDTO responseDto = modelMapper.map(createdBlog, BlogResponseDTO.class);
            return ResponseEntity.ok(responseDto);
//            return ResponseEntity.ok(blogDTO);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get all blogs
    @GetMapping
    public ResponseEntity<List<BlogResponseDTO>> getAllBlogs() {
        try {
            List<Blog> blogs = blogService.getAllBlog();

            return ResponseEntity.ok(blogs.stream().map(blog -> modelMapper.map(blog, BlogResponseDTO.class)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Get a single blog by ID
    @GetMapping("/{slug}")
    public ResponseEntity<BlogResponseDTO> getBlogBySlug(@PathVariable String slug) {
        try {
            Blog blog = blogService.getBlogBySlug(slug);
            if(blog == null){
                return ResponseEntity.notFound().build();
            }
            BlogResponseDTO blogResponseDTO = modelMapper.map(blog, BlogResponseDTO.class);
            return ResponseEntity.ok(blogResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Update a blog
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> updateBlog(@PathVariable Long id,
                                                      @ModelAttribute BlogDTO blogDTO) {
        try {
            // check exist blog, blog category
            Blog existingBlogOpt = blogService.getBlogById(id);
            BlogCategory existingBlogCategory = blogCategoryService.getBlogCategoryById(blogDTO.getBlogCategoryId());

            if (existingBlogOpt == null || existingBlogCategory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }


            Blog editBlog = modelMapper.map(blogDTO, Blog.class);
            editBlog.setCategory(existingBlogCategory);


            // update blog
            Blog updatedBlog = blogService.updateBlog(id, editBlog, blogDTO.getImage());
            BlogResponseDTO responseDto = modelMapper.map(updatedBlog, BlogResponseDTO.class);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Delete a blog
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok().body(id);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
