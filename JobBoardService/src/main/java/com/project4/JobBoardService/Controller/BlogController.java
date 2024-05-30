package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Repository.BlogCategoryRepository;
import com.project4.JobBoardService.Service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;
    @Autowired
    private BlogCategoryRepository blogCategoryRepository;

//    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
//    public ResponseEntity<Blog> createBlog(
//            @RequestParam("title") String title,
//            @RequestParam("content") String content,
//            @RequestParam("author") String author,
//            @RequestParam("blogCategoryId") Long blogCategoryId,
//            @RequestParam("publishedAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime publishedAt,
//            @RequestParam("status") Boolean status,
//            @RequestParam("image") MultipartFile image,
//            @RequestParam("slug") String slug) {
//
//        try {
//            Optional<BlogCategory> categoryOpt = blogCategoryRepository.findById(blogCategoryId);
//            if (!categoryOpt.isPresent()) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Category not found
//            }
//            BlogCategory category = categoryOpt.get();
//
//            Blog blog = new Blog();
//            blog.setTitle(title);
//            blog.setContent(content);
//            blog.setAuthor(author);
//            blog.setCategory(category);
//            blog.setPublishedAt(Date.from(publishedAt.toInstant()));
//            blog.setStatus(status);
//            blog.setSlug(slug);
//
//            Blog createdBlog = blogService.createBlog(blog, image);
//            return ResponseEntity.ok(createdBlog);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(@ModelAttribute BlogDTO blogDTO) {
        Optional<BlogCategory> categoryOpt = blogCategoryRepository.findById(blogDTO.getBlogCategoryId());
        if (!categoryOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Category not found
        }
        BlogCategory category = categoryOpt.get();

        Blog blog = new Blog();

        blog.setTitle(blogDTO.getTitle());
        blog.setContent(blogDTO.getContent());
        blog.setAuthor(blogDTO.getAuthor());
        blog.setCategory(category);
        blog.setStatus(blogDTO.getStatus());
        blog.setSlug(blogDTO.getSlug());

        // Call a method in your service to handle the blog creation logic, including image processing if necessary
        try {
            Blog createdBlog = blogService.createBlog(blog, blogDTO.getImage());
            BlogResponseDTO responseDto = blogService.convertToDto(createdBlog);
            return ResponseEntity.ok(responseDto);
//            return ResponseEntity.ok(blogDTO);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
