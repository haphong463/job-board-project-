package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.DTO.NewCommentDTO;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Service.CommentService;
import org.apache.coyote.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByBlogId(@PathVariable Long blogId) {
        try {
            List<Comment> comments = commentService.getCommentByBlogId(blogId);
            return ResponseEntity.ok(comments.stream().map(comment -> modelMapper.map(comment, CommentDTO.class)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<NewCommentDTO> createComment(@RequestBody Comment comment) {
        Comment createdComment = commentService.createComment(comment);
        NewCommentDTO commentResponse = modelMapper.map(createdComment, NewCommentDTO.class);

        return ResponseEntity.ok(commentResponse);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}
