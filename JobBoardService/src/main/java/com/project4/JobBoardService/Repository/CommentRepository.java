package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository  extends JpaRepository<Comment, Long> {
    List<Comment> findAllByBlogIdAndParentIdIsNull(Long blogId);
}
