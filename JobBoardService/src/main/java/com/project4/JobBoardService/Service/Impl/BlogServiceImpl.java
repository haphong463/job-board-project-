package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;


    @Override
    public List<Blog> getAllBlog() {
        return blogRepository.findAll();
    }

    @Override
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    public Blog updateBlog(Long id, Blog blog) {
        Optional<Blog> optionalBlog = blogRepository.findById(id);
        if (optionalBlog.isPresent()) {
            Blog existingBlog = optionalBlog.get();
            existingBlog.setTitle(blog.getTitle());
            existingBlog.setAuthor(blog.getAuthor());
            existingBlog.setContent(blog.getContent());
            existingBlog.setCreated_at(blog.getCreated_at());
            return blogRepository.save(existingBlog);
        } else {
            throw new RuntimeException("Blog not found with id " + id);
        }
    }

    @Override
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found with id " + id));
    }

    @Override
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }
}
