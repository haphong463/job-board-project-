package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.Message;
import com.project4.JobBoardService.Entity.User;

import java.util.List;

public interface MessageService {
    Message saveMessage(Message message);
    void deleteMessage(Long id);
    List<Message> getMessagesBySender(User sender);
}
