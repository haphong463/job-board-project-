package com.project4.JobBoardService.Controller;//package com.project4.JobBoardService.Controller;
//
//import com.project4.JobBoardService.DTO.MessageDTO;
//import com.project4.JobBoardService.DTO.NotificationDTO;
//import com.project4.JobBoardService.Entity.Message;
//import com.project4.JobBoardService.Entity.Notification;
//import com.project4.JobBoardService.Entity.User;
//import com.project4.JobBoardService.Service.MessageService;
//import com.project4.JobBoardService.Service.UserService;
//import org.apache.coyote.Response;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/message")
//public class ChatController {
//
//    @Autowired
//    private  SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    private MessageService messageService;
//
//    @Autowired
//    private ModelMapper modelMapper;
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/send")
//    public ResponseEntity<MessageDTO> sendPrivateMessage(@RequestBody MessageDTO messageDTO) {
//        try {
////            User sender = userService.findByUsername(messageDTO.getSender().getUsername()).orElse(null);
////            if (sender == null) {
////                return ResponseEntity.badRequest().build(); // Nếu không tìm thấy User, trả về lỗi BadRequest
////            }
////
////            User recipient = userService.findByUsername(messageDTO.getRecipient().getUsername()).orElse(null);
////            if (recipient == null) {
////                return ResponseEntity.badRequest().build(); // Nếu không tìm thấy User, trả về lỗi BadRequest
////            }
////
////            if(sender == recipient){
////                return ResponseEntity.badRequest().build();
////            }
////
////            Message message = modelMapper.map(messageDTO, Message.class);
////            message.setSender(sender);
////            message.setRecipient(recipient);
////
////            Message created = messageService.saveMessage(message);
////            MessageDTO response = modelMapper.map(created, MessageDTO.class);
//            messagingTemplate.convertAndSend("/topic/message", messageDTO);
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//
//
//    @GetMapping("/{id}")
//    public ResponseEntity<List<MessageDTO>> getNotificationByRecipientId(@PathVariable Long id){
//        try {
//            User user = userService.findById(id).orElse(null);
//            if(user == null){
//                return ResponseEntity.badRequest().build();
//            }
//            List<Message> list = messageService.getMessagesBySender(user);
//            List<MessageDTO> listDTO = list.stream().map(message ->
//                    modelMapper.map(message, MessageDTO.class)
//            ).collect(Collectors.toList());
//            return ResponseEntity.ok(listDTO);
//        }catch(Exception e){
//            return ResponseEntity.internalServerError().build();
//        }
//    }
//}
//
//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public MessageModel receiveMessage(@Payload MessageModel message){
        return message;
    }

    @MessageMapping("/private-message")
    public MessageModel recMessage(@Payload MessageModel message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        System.out.println(message.toString());
        return message;
    }
}