package com.project4.JobBoardService.Service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String firstName, String verificationCode, String email);
    void sendEmailNotification(String toEmail, String subject, String message);
    void sendResetPasswordEmail(String toEmail, String resetToken);
}