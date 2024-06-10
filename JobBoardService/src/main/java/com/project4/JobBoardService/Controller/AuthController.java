package com.project4.JobBoardService.Controller;
import com.project4.JobBoardService.Entity.Role;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Repository.RoleRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Util.HTMLContentProvider;
import com.project4.JobBoardService.payload.JwtResponse;
import com.project4.JobBoardService.payload.LoginRequest;
import com.project4.JobBoardService.payload.MessageResponse;
import com.project4.JobBoardService.payload.SignupRequest;
import com.project4.JobBoardService.security.UserDetailsImpl;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());
        if (!optionalUser.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found!"));
        }

        User user = optionalUser.get();
        if (!user.isVerified()) {
            return ResponseEntity.ok().body(user.isVerified());
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Email not verified! Please verify your email to login."));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getGender());
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);

        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationCode, user.getEmail());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signOutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("User signed out successfully!"));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String resetToken = generateResetToken();


            String resetUrl = "http://localhost:8080/api/auth/reset-password?email=" + email + "&token=" + resetToken;
            user.setResetToken(resetToken);
            userRepository.save(user);

            emailService.sendResetPasswordEmail(user.getEmail(), resetUrl);

            return ResponseEntity.ok(new MessageResponse("Reset password email sent successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }
    @GetMapping("/reset-password")
    public ResponseEntity<?> showResetPasswordForm(@RequestParam("email") String email,
                                                   @RequestParam("token") String token) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getResetToken() != null && user.getResetToken().equals(token)) {

                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid reset token!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("email") String email,
                                           @RequestParam("token") String token,
                                           @RequestParam("newPassword") String newPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getResetToken() != null && user.getResetToken().equals(token)) {
                user.setPassword(encoder.encode(newPassword));
                user.setResetToken(null);
                userRepository.save(user);
                return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid reset token!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }


    @RequestMapping(value = "/verify", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> verifyEmail(
            @RequestParam("email") String email,
            @RequestParam("code") String code,
            @RequestParam("verifyUrl") String verifyUrl
    ) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String latestVerificationCode = user.getVerificationCode();
            if (latestVerificationCode != null && latestVerificationCode.equals(code)) {
                user.setVerified(true);
                userRepository.save(user);
                String firstName = user.getFirstName();
                String successMessage = HTMLContentProvider.verifyemailsuccess(firstName, verifyUrl);
                emailService.sendEmailNotification(user.getEmail(), "Email Verified", successMessage);
                return ResponseEntity.ok(new MessageResponse("Email verified successfully!"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid verification code!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found!"));
        }
    }

    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }
    private String generateResetToken() {
        return UUID.randomUUID().toString().substring(0, 6);
    }


}