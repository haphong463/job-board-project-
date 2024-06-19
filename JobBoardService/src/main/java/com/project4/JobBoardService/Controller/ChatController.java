package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.MessageDTO;
import com.project4.JobBoardService.Entity.Message;
import com.project4.JobBoardService.Service.MessageService;
import org.apache.coyote.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/message")
public class ChatController {

    @Autowired
    private  SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private ModelMapper modelMapper;
    @PostMapping("/send")
    public ResponseEntity<?> sendPrivateMessage(@RequestBody MessageDTO messageDTO) {
        try {

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}