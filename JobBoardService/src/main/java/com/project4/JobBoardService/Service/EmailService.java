package com.project4.JobBoardService.Service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String firstName, String verificationCode);
    void sendEmailNotification(String toEmail, String subject, String message);
    void sendResetPasswordEmail(String toEmail, String resetToken);
}