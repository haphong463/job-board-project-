package com.project4.JobBoardService.Util;

public class HTMLContentProvider {

    public static String readHTMLContent() {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".button { display: block; width: 200px; margin: 0 auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello {{firstName}},</p>" +
                "<p>Please use the following code to verify your email:</p>" +
                "<a href='{{verifyUrl}}' class='button'>Verify Email</a>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    public static String verifyemailsuccess(String firstName, String verifyUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".button { display: block; width: 200px; margin: 0 auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello " + firstName + ",</p>" +
                "<p>Your email has been verified successfully!</p>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    public static String resetPasswordContent(String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Reset Password</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".button { display: block; width: 200px; margin: 0 auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Reset Password</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>To reset your password, please click on the following link:</p>" +
                "<a href='" + resetUrl + "' class='button'>Reset Password</a>" +
                "<p>If you did not request a password reset, please ignore this email.</p>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

}
