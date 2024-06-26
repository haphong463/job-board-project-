package com.project4.JobBoardService.Controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project4.JobBoardService.Entity.Template;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;
import com.project4.JobBoardService.Entity.UserDetail;
import com.project4.JobBoardService.Repository.TemplateRepository;
import com.project4.JobBoardService.Repository.UserCvRepository;
import com.project4.JobBoardService.Repository.UserDetailRepository;
import com.project4.JobBoardService.Repository.UserRepository;

@RestController
@RequestMapping("/api/usercv")
public class UserCvController {
	@Autowired
	UserCvRepository userCvRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	UserDetailRepository userDetailRepository;
	@Autowired
	TemplateRepository templateRepository;

	@GetMapping("")
	public String createCV(Model model) {
		model.addAttribute("userCV", new UserCV());
		return "create-cv";
	}
	
	@GetMapping("/viewCV")
    public String getCV(Model model) {
        List<UserCV> userCV = userCvRepository.findAll();
        model.addAttribute("userCV", userCV);
        return "user-cv";
    }
	
//	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	@PostMapping("/submit-cv")
	public ResponseEntity<String> submitCv(@ModelAttribute UserCV userCV, @RequestParam("profileImage") MultipartFile profileImage) {
	    userCV.setCreatedAt(LocalDateTime.now());
	    userCV.setUpdatedAt(LocalDateTime.now());

	    // Set userCV reference in related entities
	    userCV.getUserDetails().forEach(detail -> detail.setUserCV(userCV));
	    userCV.getUserEducations().forEach(education -> education.setUserCV(userCV));
	    userCV.getUserExperiences().forEach(experience -> experience.setUserCV(userCV));
	    userCV.getUserSkills().forEach(skill -> skill.setUserCV(userCV));
	    userCV.getUserProjects().forEach(project -> project.setUserCV(userCV));
	    userCV.getUserLanguages().forEach(language -> language.setUserCV(userCV));

	    // Save the userCV and its related entities
	    UserCV savedUserCV = userCvRepository.save(userCV);

	    // Handle the profile image upload
	    if (!profileImage.isEmpty()) {
	        try {
	            byte[] imageBytes = profileImage.getBytes();
	            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
	            UserDetail userDetail = savedUserCV.getUserDetails().get(0);
	            userDetail.setProfileImageBase64(base64Image);
	            userDetailRepository.save(userDetail);
	        } catch (IOException e) {
	            // Handle the exception
	            e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving profile image");
	        }
	    }

	    return ResponseEntity.ok().body("CV Save Success!");
	}

	@PutMapping("/select-template")
    public ResponseEntity<String> selectTemplate(@RequestParam("cvId") Long cvId, @RequestParam("userId") Long userId, @RequestParam("templateId") Long templateId) {
        try {
            // Find UserCV by cvId
            UserCV userCV = userCvRepository.findById(cvId).orElse(null);

            if (userCV == null) {
                return ResponseEntity.notFound().build();
            }

            // Find user and template
            User user = userRepository.findById(userId).orElse(null);
            Template template = templateRepository.findById(templateId).orElse(null);

            if (user == null || template == null) {
                return ResponseEntity.badRequest().body("Invalid user or template ID");
            }

            // Update user_id and template_id
            userCV.setUser(user);
            userCV.setTemplate(template);

            // Save updated UserCV
            userCvRepository.save(userCV);

            return ResponseEntity.ok("UserCV updated successfully with selected template");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update UserCV: " + e.getMessage());
        }
    }




	
//	@PostMapping("/submit-cv")
//    public ResponseEntity<String> submitCv(
//            @ModelAttribute UserCV userCV,
//            @RequestParam("profileImage") MultipartFile profileImage,
//            @RequestParam("userId") Long userId) {
//
//        // Find the user by userId
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Associate User with UserCV
//        userCV.setUser(user);
//        userCV.setCreatedAt(LocalDateTime.now());
//        UserCV savedUserCV = userCvRepository.save(userCV);
//
//        // Handle the profile image upload
//        if (!profileImage.isEmpty()) {
//            try {
//                byte[] imageBytes = profileImage.getBytes();
//                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//                if (!savedUserCV.getUserDetails().isEmpty()) {
//                    UserDetail userDetail = savedUserCV.getUserDetails().get(0);
//                    userDetail.setProfileImageBase64(base64Image);
//                    userDetailRepository.save(userDetail);
//                }
//            } catch (IOException e) {
//                return ResponseEntity.status(500).body("Image Upload Failed");
//            }
//        }
//        return ResponseEntity.ok().body("CV Save Success!");
//    }
//	

//	 @GetMapping("/view-template/{id}")
//	    public String viewTemplate(@PathVariable("id") Long templateId, Model model, Authentication authentication) {
//	        // Retrieve the selected template
//	        Template template = templateRepository.findById(templateId)
//	                .orElseThrow(() -> new RuntimeException("Template not found"));
//
//	        // Retrieve the authenticated user's id
//	        Long userId = getUserIdFromAuthentication(authentication);
//
//	        // Retrieve the user's CV data from the database
//	        UserCV userCV = userCvRepository.findById(userId)
//	                .orElseThrow(() -> new RuntimeException("User CV not found"));
//
//	        // Read the HTML file content from the template's file path
//	        String filePath = template.getTemplateFilePath();
//	        String htmlContent;
//	        try {
//	            htmlContent = Files.readString(Paths.get(filePath));
//	        } catch (IOException e) {
//	            throw new RuntimeException("Failed to read template file", e);
//	        }
//
//	        // Replace placeholders in the HTML content with actual data
//	        htmlContent = replacePlaceholders(htmlContent, userCV, template);
//
//	        model.addAttribute("userCV", userCV);
//	        model.addAttribute("template", template);
//	        model.addAttribute("htmlContent", htmlContent);
//
//	        return "view-template";
//	    }
//	 private String replacePlaceholders(String htmlContent, UserCV userCV, Template template) {
//	        // Replace placeholders with actual data
//	        htmlContent = htmlContent.replace("{{cvTitle}}", userCV.getCvTitle());
//	        htmlContent = htmlContent.replace("{{fullName}}", userCV.getUserDetails().get(0).getFullName());
//	        // Add more placeholder replacements for other data fields
//
//	        return htmlContent;
//	    }



	 


}
