package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.Config.Annotation.CheckPermission;
import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.HashTag;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.EPermissions;
import com.project4.JobBoardService.Service.BlogCategoryService;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.payload.PaginatedResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ModelMapper modelMapper;


    @GetMapping("/search")
    public ResponseEntity<?> searchBlogs(
            @RequestParam String query,
            @RequestParam(defaultValue = "ALL") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer visibility,
            @RequestParam(defaultValue = "asc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("desc") ? Sort.by("createdAt").descending() : Sort.by("createdAt").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Boolean visibilityFlag = visibility == 0 ? Boolean.TRUE : visibility == 1 ? Boolean.FALSE : null;


        Page<Blog> blogsPage = blogService.searchBlogs(query, "ALL".equals(type) ? null : type, pageable, visibilityFlag);

        List<BlogResponseDTO> blogResponseDTOs = blogsPage.stream()
                .map(blog -> modelMapper.map(blog, BlogResponseDTO.class))
                .collect(Collectors.toList());

        PaginatedResponse<BlogResponseDTO> response = new PaginatedResponse<>();
        response.setContent(blogResponseDTOs);
        response.setCurrentPage(blogsPage.getNumber());
        response.setTotalPages(blogsPage.getTotalPages());
        response.setTotalItems(blogsPage.getTotalElements());

        return ResponseEntity.ok(response);
    }




    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(@ModelAttribute BlogDTO blogDTO) {
        try {
            List<Long> categoryIds = blogDTO.getCategoryIds();
            List<BlogCategory> categories = categoryIds.stream()
                    .map(id -> blogCategoryService.getBlogCategoryById(id))
                    .collect(Collectors.toList());

            if (categories.stream().anyMatch(category -> category == null)) {
                return ResponseEntity.badRequest().build();
            }
            User user = userService.findByUsername(blogDTO.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().build();
            }

            String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            if (username.equals(user.getUsername())) {
                Blog blog = modelMapper.map(blogDTO, Blog.class);
                blog.setUser(user);
                blog.setCategories(categories);
                Blog createdBlog = blogService.createBlog(blog, blogDTO.getImage(), blogDTO.getHashtags());
                BlogResponseDTO responseDto = modelMapper.map(createdBlog, BlogResponseDTO.class);
                return ResponseEntity.ok(responseDto);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all blogs
    @GetMapping
    public ResponseEntity<List<BlogResponseDTO>> getAllBlogs() {
        try {
            List<Blog> blogs = blogService.getAllBlog();

            List<BlogResponseDTO> blogResponseDTOs = blogs.stream().map(blog -> {
                BlogResponseDTO blogResponseDTO = modelMapper.map(blog, BlogResponseDTO.class);
                blogResponseDTO.setCommentCount(blog.getComments().size());  // Set the number of comments
                return blogResponseDTO;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(blogResponseDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get a single blog by slug
    @GetMapping("/{slug}")
    public ResponseEntity<BlogResponseDTO> getBlogBySlug(@PathVariable String slug) {
        try {
            Blog blog = blogService.getBlogBySlug(slug);
            if (blog == null) {
                return ResponseEntity.notFound().build();
            }
            BlogResponseDTO blogResponseDTO = modelMapper.map(blog, BlogResponseDTO.class);
            return ResponseEntity.ok(blogResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update a blog
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @PutMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> updateBlog(@PathVariable Long id,
                                                      @ModelAttribute BlogDTO blogDTO) {
        try {
            // Lấy danh sách id của BlogCategory từ BlogDTO
            List<Long> categoryIds = blogDTO.getCategoryIds();
            List<BlogCategory> categories = categoryIds.stream()
                    .map(ids -> blogCategoryService.getBlogCategoryById(ids))
                    .collect(Collectors.toList());

            // Kiểm tra xem tất cả các BlogCategory có tồn tại không
            if (categories.stream().anyMatch(category -> category == null)) {
                return ResponseEntity.badRequest().build(); // Nếu một trong các BlogCategory không tồn tại, trả về lỗi BadRequest
            }


            Blog blog = modelMapper.map(blogDTO, Blog.class);
            blog.setCategories(categories);


            // Update blog
            Blog updatedBlog = blogService.updateBlog(id, blog, blogDTO.getImage(), blogDTO.getHashtags());
            if(updatedBlog != null){
                BlogResponseDTO responseDto = modelMapper.map(updatedBlog, BlogResponseDTO.class);
                return ResponseEntity.ok(responseDto);
            }

            return ResponseEntity.notFound().build();

            // Map Blog đã cập nhật thành BlogResponseDTO và gửi thông báo WebSocket
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a blog
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok().body(id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
