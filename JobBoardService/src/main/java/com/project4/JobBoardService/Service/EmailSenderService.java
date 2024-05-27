package com.project4.JobBoardService.Service;

public interface EmailSenderService  {
    void sendMail(String toEmail, String subject, String body);
}
