package com.project4.JobBoardService.Controller;
import com.project4.JobBoardService.Config.ErrorDetails;
import com.project4.JobBoardService.Entity.Employer;
import com.project4.JobBoardService.Entity.Role;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Repository.EmployerRepository;
import com.project4.JobBoardService.Repository.RoleRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Util.HTMLContentProvider;
import com.project4.JobBoardService.payload.*;
import com.project4.JobBoardService.security.UserDetailsImpl;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
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
    private EmployerRepository employerRepository;
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
                    .body(new ErrorDetails(
                            new Date(),
                            "Bad credentials",
                            "The user with username " + loginRequest.getUsername() + " was not found"
                    ));
        }

        User user = optionalUser.get();
        if (!user.isVerified()) {
            return ResponseEntity.ok().body(new AuthRepsonse(
                user.getEmail(),
                    user.isVerified()
            ));
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
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), user.getFirstName(), verificationCode, user.getEmail());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


    //Employer
    @PostMapping("/registerEmployer")
    public ResponseEntity<?> registerEmployer(@Valid @RequestBody EmployerSignupRequest signUpRequest) {
        if (employerRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Employer employer = new Employer();
        employer.setName(signUpRequest.getName());
        employer.setTitle(signUpRequest.getTitle());
        employer.setEmail(signUpRequest.getEmail());
        employer.setPhoneNumber(signUpRequest.getPhoneNumber());
        employer.setCompanyName(signUpRequest.getCompanyName());
        employer.setCompanyAddress(signUpRequest.getCompanyAddress());
        employer.setCompanyWebsite(signUpRequest.getCompanyWebsite());

        String verificationCode = UUID.randomUUID().toString();
        employer.setVerificationCode(verificationCode);
        employer.setVerified(false);

        employerRepository.save(employer);

        emailService.sendVerificationEmailEmployer(employer.getEmail(), employer.getName(), verificationCode);

        return ResponseEntity.ok(new MessageResponse("Employer registered successfully! Please check your email for verification instructions."));
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
            String resetUrl = "http://localhost:3000/ResetPassword?email=" + email + "&token=" + resetToken;

            user.setResetToken(resetToken);
            userRepository.save(user);

            emailService.sendResetPasswordEmail(user.getEmail(), resetUrl);

            return ResponseEntity.ok(new MessageResponse("Reset password email sent successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }
    @PostMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam("email") String email,
                                              @RequestParam("token") String token) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getResetToken() != null && user.getResetToken().equals(token)) {
                return ResponseEntity.ok(new MessageResponse("Token is valid."));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid reset token!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<?> setNewPassword(@RequestParam("email") String email,
                                            @RequestParam("token") String token,
                                            @RequestParam("newPassword") String newPassword,
                                            @RequestParam("confirmPassword") String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Passwords do not match!"));
        }
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
//VerifyUser
    @RequestMapping(value = "/verify", method = {RequestMethod.GET, RequestMethod.POST})
    public void verifyEmail(
            @RequestParam("email") String email,
            @RequestParam("code") String code,
            @RequestParam("verifyUrl") String verifyUrl,
            HttpServletResponse response
    ) throws IOException {
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
                response.sendRedirect(verifyUrl + "?message=Email verified successfully!");
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid verification code!");
            }
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "User not found!");
        }
    }
    //Verify Employer
    @RequestMapping(value = "/verify-employer", method = {RequestMethod.GET, RequestMethod.POST})
    public void verifyEmployer(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        Employer employer = employerRepository.findByVerificationCode(code);
        if (employer == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Error: Invalid verification code.");
        } else {
            employer.setVerified(true);
            employer.setVerificationCode(null);
            employerRepository.save(employer);

            response.sendRedirect("http://localhost:3000/SetupCredentials?message=Employer verified successfully!");
        }
    }
//Username password Employer
@PostMapping("/setup-credentials")
public ResponseEntity<?> setupCredentials(@Valid @RequestBody PasswordSetupRequest passwordSetupRequest) {
    Employer employer = employerRepository.findByVerificationCode(passwordSetupRequest.getCode());
    if (employer == null) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Invalid verification code."));
    }

    if (!passwordSetupRequest.getPassword().equals(passwordSetupRequest.getConfirmPassword())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Passwords do not match!"));
    }

    if (userRepository.existsByUsername(passwordSetupRequest.getUsername())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(employer.getEmail())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
    }

    User user = new User();
    user.setUsername(passwordSetupRequest.getUsername());
    user.setEmail(employer.getEmail());
    user.setFirstName(employer.getName());
    user.setLastName(employer.getTitle());
    user.setPassword(encoder.encode(passwordSetupRequest.getPassword()));

    Set<Role> roles = new HashSet<>();
    Role employerRole = roleRepository.findByName(ERole.ROLE_EMPLOYER)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    roles.add(employerRole);
    user.setRoles(roles);

    String verificationCode = employer.getVerificationCode();
    user.setVerificationCode(verificationCode);
    user.setVerified(false);

    userRepository.save(user);

    employer.setUser(user);
    employer.setVerified(true);
    employerRepository.save(employer);

    emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), user.getFirstName(), verificationCode, user.getEmail());

    return ResponseEntity.ok(new MessageResponse("Username and password setup successfully! Please check your email to verify your account."));
}


    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }
    private String generateResetToken() {
        return UUID.randomUUID().toString().substring(0, 6);
    }


}