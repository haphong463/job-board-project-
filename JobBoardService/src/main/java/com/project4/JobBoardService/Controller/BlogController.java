package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.BlogCategoryService;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.Payload.PaginatedResponse;
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
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(defaultValue = "2") int visibility,
            @RequestParam(defaultValue = "asc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("desc") ? Sort.by("createdAt").descending() : Sort.by("createdAt").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Blog> blogsPage;
        if(type.equals("ALL")){
            blogsPage = switch (visibility) {
                case 0 -> blogService.searchBlogs(query, pageable, true);
                case 1 -> blogService.searchBlogs(query, pageable, false);
                default -> blogService.searchBlogs(query, pageable);
            };
        }else{
            blogsPage = switch (visibility) {
                case 0 -> blogService.searchBlogs(query, type, pageable, true);
                case 1 -> blogService.searchBlogs(query, type, pageable, false);
                default -> blogService.searchBlogs(query, type, pageable);
            };
        }
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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(@ModelAttribute BlogDTO blogDTO) {
        try {
            // Lấy danh sách id của BlogCategory từ BlogDTO
            List<Long> categoryIds = blogDTO.getCategoryIds();
            List<BlogCategory> categories = categoryIds.stream()
                    .map(id -> blogCategoryService.getBlogCategoryById(id))
                    .collect(Collectors.toList());

            // Kiểm tra xem tất cả các BlogCategory có tồn tại không
            if (categories.stream().anyMatch(category -> category == null)) {
                return ResponseEntity.badRequest().build(); // Nếu một trong các BlogCategory không tồn tại, trả về lỗi BadRequest
            }

            // Tìm User từ username trong BlogDTO
            User user = userService.findByUsername(blogDTO.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().build(); // Nếu không tìm thấy User, trả về lỗi BadRequest
            }

            // Map BlogDTO thành Blog
            Blog blog = modelMapper.map(blogDTO, Blog.class);
            blog.setUser(user);
            blog.setCategories(categories);

            // Gọi phương thức trong service để xử lý logic tạo Blog, bao gồm xử lý hình ảnh nếu cần
            Blog createdBlog = blogService.createBlog(blog, blogDTO.getImage());

            // Map Blog đã tạo thành BlogResponseDTO và gửi thông báo WebSocket
            BlogResponseDTO responseDto = modelMapper.map(createdBlog, BlogResponseDTO.class);
//            simpMessagingTemplate.convertAndSend("/topic/new-blog", responseDto);

            return ResponseEntity.ok(responseDto);
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
            Blog updatedBlog = blogService.updateBlog(id, blog, blogDTO.getImage());

            // Map Blog đã cập nhật thành BlogResponseDTO và gửi thông báo WebSocket
            BlogResponseDTO responseDto = modelMapper.map(updatedBlog, BlogResponseDTO.class);
            simpMessagingTemplate.convertAndSend("/topic/edit-blog", responseDto);

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a blog
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            simpMessagingTemplate.convertAndSend("/topic/delete-blog", id);
            return ResponseEntity.ok().body(id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
