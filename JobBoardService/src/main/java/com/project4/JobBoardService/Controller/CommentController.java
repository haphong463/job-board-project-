package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.DTO.NewCommentDTO;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.CommentService;
import com.project4.JobBoardService.Service.UserService;
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
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/blog/{slug}")
    public ResponseEntity<List<CommentDTO>> getCommentsByBlogId(@PathVariable String slug) {
        try {
            List<Comment> comments = commentService.getCommentByBlogSlug(slug);
            return ResponseEntity.ok(comments.stream().map(comment -> modelMapper.map(comment, CommentDTO.class)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        try {
            User user = userService.findByUsername(comment.getUser().getUsername()).orElse(null);
            if(user != null){
                comment.setUser(user);
                Comment createdComment = commentService.createComment(comment);
                NewCommentDTO commentResponse = modelMapper.map(createdComment, NewCommentDTO.class);
                return ResponseEntity.ok(commentResponse);

            }
            return ResponseEntity.badRequest().body(null);


        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
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
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
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
