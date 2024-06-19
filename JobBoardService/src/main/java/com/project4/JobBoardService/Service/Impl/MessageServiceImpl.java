package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.Message;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.MessageRepository;
import com.project4.JobBoardService.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    @Override
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

    @Override
    public List<Message> getMessagesBySender(User sender) {
        return messageRepository.findBySender(sender);
    }
}
