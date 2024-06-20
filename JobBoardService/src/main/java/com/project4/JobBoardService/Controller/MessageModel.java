package com.project4.JobBoardService.Controller;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class MessageModel {
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;
}
