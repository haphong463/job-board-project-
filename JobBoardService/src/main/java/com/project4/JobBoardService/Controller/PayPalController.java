package com.project4.JobBoardService.Controller;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.project4.JobBoardService.Entity.Subscription;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Service.PayPalService;
import com.project4.JobBoardService.Service.TransactionService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
public class PayPalController {

    @Autowired
    private PayPalService payPalService;

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService; // Inject EmailService

    // Đảm bảo có service để lưu transaction

    @Value("${paypal.success.url}")
    private String successUrl;

    @Value("${paypal.cancel.url}")
    private String cancelUrl;

    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @GetMapping("/pay")
    public ResponseEntity<?> pay(@RequestParam("total") double total) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            Payment payment = payPalService.createPayment(
                    total, // Use the passed total value
                    "USD",
                    "paypal",
                    "sale",
                    "Subscription Payment",
                    cancelUrl,
                    successUrl + "?username=" + username
            );
            for (Links links : payment.getLinks()) {
                if ("approval_url".equals(links.getRel())) {
                    return ResponseEntity.ok(links.getHref());
                }
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No approval URL found");
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment creation failed");
        }
    }




    @GetMapping("/execute")
    public ResponseEntity<?> executePayment(@RequestParam("paymentId") String paymentId,
                                            @RequestParam("PayerID") String payerId,
                                            @RequestParam("username") String username) {
        try {
            Optional<User> userOptional = userService.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();
            Payment payment = payPalService.executePayment(paymentId, payerId);
            if ("approved".equals(payment.getState())) {
                double totalAmount = Double.parseDouble(payment.getTransactions().get(0).getAmount().getTotal());
                int postLimit;

                // Determine post limit based on the total amount
                if (totalAmount == 10.0) {
                    postLimit = 30;
                } else if (totalAmount == 20.0) {
                    postLimit = 70;
                } else if (totalAmount == 29.0) {
                    postLimit = 100;
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payment amount");
                }

                Subscription subscription = new Subscription();
                subscription.setUser(user);
                subscription.setPostLimit(postLimit);
                subscription.setStartDate(LocalDate.now());
                subscription.setEndDate(LocalDate.now().plusMonths(1)); // 1 month
                subscription.setAmount(totalAmount);

                transactionService.saveTransaction(subscription); // Save to database

                // Send email notification
                String subject = "Subscription Purchase Successful";
                // Tạo nội dung HTML cho email
                // Tạo nội dung HTML cho email
                String message = "<html><body>" +
                        "<div style='font-family: Arial, sans-serif;'>" +
                        "<div style='background-color: #007bff; color: #ffffff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;'>" +
                        "<h2>Subscription Purchase Successful</h2>" +
                        "</div>" +
                        "<div style='background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>" +
                        "<p>Dear " + user.getUsername() + ",</p>" +
                        "<p>Your subscription purchase was successful.</p>" +
                        "<p>Subscription Details:</p>" +
                        "<table style='width: 100%; border-collapse: collapse;'>" + // collapse borders for better appearance
                        "<tr style='border-bottom: 1px solid #ddd;'>" +
                        "<td style='padding: 8px;'><strong>Post Limit:</strong></td><td style='padding: 8px;'>" + subscription.getPostLimit() + "</td></tr>" +
                        "<tr style='border-bottom: 1px solid #ddd;'>" +
                        "<td style='padding: 8px;'><strong>Start Date:</strong></td><td style='padding: 8px;'>" + subscription.getStartDate() + "</td></tr>" +
                        "<tr style='border-bottom: 1px solid #ddd;'>" +
                        "<td style='padding: 8px;'><strong>End Date:</strong></td><td style='padding: 8px;'>" + subscription.getEndDate() + "</td></tr>" +
                        "<tr style='border-bottom: 1px solid #ddd;'>" +
                        "<td style='padding: 8px;'><strong>Amount:</strong></td><td style='padding: 8px;'>" + subscription.getAmount() + "</td></tr>" +
                        "</table>" +
                        "<p>Thank you!</p>" +
                        "</div>" +
                        "</div>" +
                        "</body></html>";


                emailService.sendEmailNotification(user.getEmail(), subject, message);

                return ResponseEntity.ok("Subscription created successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not approved");
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment execution failed");
        }
    }




    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @GetMapping("/status")
    public ResponseEntity<?> getSubscriptionStatus(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Optional<User> userOptional = userService.findByUsername(username);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOptional.get();
        Optional<Subscription> subscription = transactionService.findActiveSubscriptionByUser(user, LocalDate.now());

        if (subscription.isPresent()) {
            return ResponseEntity.ok(subscription.get());
        } else {
            return ResponseEntity.notFound().build();
        }

    }

}