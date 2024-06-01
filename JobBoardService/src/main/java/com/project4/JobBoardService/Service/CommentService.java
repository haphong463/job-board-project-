package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.Entity.Comment;

import java.util.List;

public interface CommentService {
    List<CommentDTO> getCommentByBlogId(Long blogId);
    Comment createComment(Comment comment);
    void deleteComment(Long id);

}
