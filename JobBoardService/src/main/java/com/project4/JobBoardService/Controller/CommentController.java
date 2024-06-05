package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.DTO.NewCommentDTO;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Service.CommentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByBlogId(@PathVariable Long blogId) {
        try {
            List<Comment> comments = commentService.getCommentByBlogId(blogId);
            return ResponseEntity.ok(comments.stream().map(comment -> modelMapper.map(comment, CommentDTO.class)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<NewCommentDTO> createComment(@RequestBody Comment comment) {
        try {
            Comment createdComment = commentService.createComment(comment);
            NewCommentDTO commentResponse = modelMapper.map(createdComment, NewCommentDTO.class);

            return ResponseEntity.ok(commentResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Comment> deleteComment(@PathVariable Long id) {
        try{
            Comment existingComment = commentService.getCommentById(id);
            if(id != null){
                commentService.deleteComment(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @RequestBody  Comment comment){
        try {
            Comment commentUpdate = commentService.updatedComment(id, comment);
            if(commentUpdate != null){
                CommentDTO commentUpdateDTO = modelMapper.map(commentUpdate, CommentDTO.class);
                return ResponseEntity.ok(commentUpdateDTO);
            }
            return ResponseEntity.notFound().build();
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
