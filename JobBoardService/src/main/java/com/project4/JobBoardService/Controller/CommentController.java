package com.project4.JobBoardService.Controller;
import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/blog/{blogId}")
    public List<CommentDTO> getCommentsByBlogId(@PathVariable Long blogId) {
        return commentService.getCommentByBlogId(blogId);
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}
