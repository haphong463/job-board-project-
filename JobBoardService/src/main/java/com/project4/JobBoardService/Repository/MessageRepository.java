package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Message;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySender(User sender);

}
