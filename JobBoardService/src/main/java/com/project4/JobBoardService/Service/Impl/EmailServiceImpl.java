package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Util.HTMLContentProvider;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.IOException;
import java.util.Properties;

import static com.project4.JobBoardService.Util.HTMLContentProvider.generateEmailHTMLContent;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.password}")
    private String fromEmailPassword;

    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    @Override
    public void sendVerificationEmail(String toEmail, String username, String firstName, String verificationCode, String email) {
        Properties properties = new Properties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");

        String verifyUrl = "http://localhost:8080/api/auth/verify?email=" + email + "&code=" + verificationCode + "&verifyUrl=http://localhost:3000";

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, fromEmailPassword);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject("Email Verification");

            String emailContent = HTMLContentProvider.readHTMLContent();
            emailContent = emailContent.replace("{{username}}", username);
            emailContent = emailContent.replace("{{verifyUrl}}", verifyUrl);

            message.setContent(emailContent, "text/html");

            Transport.send(message);
            System.out.println("Email sent successfully!");
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }

    @Async
    public void sendVerificationEmailEmployer(String toEmail, String name, String verificationCode) {
        String verificationUrl = "http://localhost:3000/SetupCredentials";
        String subject = "Email Verification";
        String body = generateEmailHTMLContent(name, verificationCode, verificationUrl);

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendEmailNotification(String toEmail, String subject, String message) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(message, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendResetPasswordEmail(String toEmail, String resetUrl) {
        String emailContent = HTMLContentProvider.resetPasswordContent(resetUrl);
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Reset Password Request");
            helper.setText(emailContent, true);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}