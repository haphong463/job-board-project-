package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Service.BlogCategoryService;
import com.project4.JobBoardService.Service.BlogService;
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
    private ModelMapper modelMapper;

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
@PreAuthorize(" hasRole('ADMIN')")
//@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(@ModelAttribute BlogDTO blogDTO) {
        BlogCategory category = blogCategoryService.getBlogCategoryById(blogDTO.getBlogCategoryId());
        if (category == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Category not found
        }

        Blog blog = new Blog();

        blog.setTitle(blogDTO.getTitle());
        blog.setContent(blogDTO.getContent());
        blog.setAuthor(blogDTO.getAuthor());
        blog.setCategory(category);
        blog.setStatus(blogDTO.getStatus());
        blog.setSlug(blogDTO.getSlug());

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
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<BlogResponseDTO>> getAllBlogs() {
        try {
            List<Blog> blogs = blogService.getAllBlog();

            return ResponseEntity.ok(blogs.stream().map(blog -> modelMapper.map(blog, BlogResponseDTO.class)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Get a single blog by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<BlogResponseDTO> getBlogById(@PathVariable Long id) throws ResourceNotFoundException {
//        try {
//            Blog blog = blogService.getBlogById(id);
//            if(blog == null){
//                return ResponseEntity.notFound().build();
//            }
//            BlogResponseDTO blogResponseDTO = modelMapper.map(blog, BlogResponseDTO.class);
//            return ResponseEntity.ok(blogResponseDTO);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    // Update a blog
    @PreAuthorize("hasRole('ADMIN')")
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
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
