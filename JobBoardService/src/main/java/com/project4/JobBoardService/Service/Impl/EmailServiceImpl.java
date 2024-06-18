package com.project4.JobBoardService.Service.Impl;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Util.HTMLContentProvider;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;
import java.util.UUID;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendVerificationEmail(String toEmail, String username,String firstName, String verificationCode,  String email) {
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");

//        String verifyUrl = "http://localhost:8080/api/auth/verify?email=" + email + "&code=" + verificationCode + "&verifyUrl=http://localhost:8080";
//
        String verifyUrl = "http://localhost:8080/api/auth/verify?email=" + email + "&code=" + verificationCode + "&verifyUrl=http://localhost:3000";

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, "lsnxvacsqrprfrbo");
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

    public void sendVerificationEmailEmployer(String toEmail, String name, String verificationCode) {
        String verificationUrl = "http://localhost:8080/api/employers/verify?code=" + verificationCode;
        String subject = "Email Verification";
        String body = "Dear " + name + ",\n\n" +
                "Thank you for registering. Please click the link below to complete your registration:\n" +
                verificationUrl + "\n\n" +
                "Best regards,\nITViec Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);
    }

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
