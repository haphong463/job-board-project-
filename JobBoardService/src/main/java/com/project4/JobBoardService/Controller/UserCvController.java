package com.project4.JobBoardService.Controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;

import com.project4.JobBoardService.DTO.UserCvDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

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
    UserEducationRepository userEducationRepository;
    @Autowired
    UserProjectRepository userProjectRepository;
    @Autowired
    UserSkillRepository userSkillRepository;
    @Autowired
    UserExperienceRepository userExperienceRepository;
    @Autowired
    UserLanguageRepository userLanguageRepository;
    @Autowired
    TemplateRepository templateRepository;

    @Autowired
    private ModelMapper modelMapper;

    //	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping("/submit-cv")
    public ResponseEntity<String> submitCv(@ModelAttribute UserCV userCV,
                                           @RequestParam("profileImage") MultipartFile profileImage,
    @RequestParam("dob") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dob) {
        userCV.setCreatedAt(LocalDateTime.now());
        userCV.setUpdatedAt(LocalDateTime.now());

        // Set the user
        User user = userRepository.findById(userCV.getUser().getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID");
        }
        userCV.setUser(user);

        // Set userCV reference in related entities
        userCV.getUserDetails().forEach(detail -> {
            detail.setUserCV(userCV);
            detail.setDob(dob); // Set the date of birth
        });
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

    @GetMapping("/view-cv/{userId}")
    public ResponseEntity<UserCvDTO> viewCv(@PathVariable Long userId) {
        UserCV existingCv = userCvRepository.findByUserId(userId);
        if (existingCv == null) {
            return ResponseEntity.notFound().build();
        }

        // Map UserCV entity to UserCvDTO using ModelMapper
        UserCvDTO userCvDTO = modelMapper.map(existingCv, UserCvDTO.class);

        return ResponseEntity.ok().body(userCvDTO);
    }

    @DeleteMapping("/delete-cv/{userId}")
    public ResponseEntity<String> deleteCvsByUserId(@PathVariable Long userId) {

        try {

          UserCV userCv =  userCvRepository.findByUserId(userId);
            if(userCv != null){
                // Delete related entities first
                userCvRepository.deleteUserDetailsByUserId(userId);
                userCvRepository.deleteUserEducationsByUserId(userId);
                userCvRepository.deleteUserExperiencesByUserId(userId);
                userCvRepository.deleteUserSkillsByUserId(userId);
                userCvRepository.deleteUserProjectsByUserId(userId);
                userCvRepository.deleteUserLanguagesByUserId(userId);

                // Delete the UserCV
                userCvRepository.deleteByUserId(userId);
                return ResponseEntity.ok().body("CVs Delete Success!");
            }
           else {
               return   ResponseEntity.notFound().build();
            }


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting CVs");
        }
    }
    @GetMapping("/check-cvs/{userId}")
    public ResponseEntity<Boolean> checkCvsByUserId(@PathVariable Long userId) {
        try {
            UserCV userCv = userCvRepository.findByUserId(userId);
            boolean hasCvs = userCv != null; // Check if UserCV exists for the given userId
            return ResponseEntity.ok().body(hasCvs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }
    @PutMapping("/update-cv/{userId}")
    public ResponseEntity<String> updateCv(@PathVariable Long userId,
                                           @ModelAttribute UserCV updatedUserCV,
                                           @RequestParam("profileImage") MultipartFile profileImage,
                                           @RequestParam("dob") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dob) {
        UserCV existingCv = userCvRepository.findByUserId(userId);
        if (existingCv == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid CV ID");
        }

        // Update CV fields
        existingCv.setCvTitle(updatedUserCV.getCvTitle());
        existingCv.setUpdatedAt(LocalDateTime.now());

        // Handle User Details including dob
        existingCv.getUserDetails().clear();
        for (UserDetail detail : updatedUserCV.getUserDetails()) {
            detail.setUserCV(existingCv);
            detail.setDob(dob); // Set the date of birth
            existingCv.getUserDetails().add(detail);
        }

        // Handle Education
        existingCv.getUserEducations().clear();
        for (UserEducation education : updatedUserCV.getUserEducations()) {
            education.setUserCV(existingCv);
            existingCv.getUserEducations().add(education);
        }

        // Handle Experiences
        existingCv.getUserExperiences().clear();
        for (UserExperience experience : updatedUserCV.getUserExperiences()) {
            experience.setUserCV(existingCv);
            existingCv.getUserExperiences().add(experience);
        }

        // Handle Skills
        existingCv.getUserSkills().clear();
        for (UserSkill skill : updatedUserCV.getUserSkills()) {
            skill.setUserCV(existingCv);
            existingCv.getUserSkills().add(skill);
        }

        // Handle Projects
        existingCv.getUserProjects().clear();
        for (UserProject project : updatedUserCV.getUserProjects()) {
            project.setUserCV(existingCv);
            existingCv.getUserProjects().add(project);
        }

        // Handle Languages
        existingCv.getUserLanguages().clear();
        for (UserLanguage language : updatedUserCV.getUserLanguages()) {
            language.setUserCV(existingCv);
            existingCv.getUserLanguages().add(language);
        }

        // Handle the profile image upload
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                byte[] imageBytes = profileImage.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                existingCv.getUserDetails().get(0).setProfileImageBase64(base64Image);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile image");
            }
        } else {
            UserDetail existingDetail = existingCv.getUserDetails().get(0);
            UserDetail updatedDetail = updatedUserCV.getUserDetails().get(0);
            updatedDetail.setProfileImageBase64(existingDetail.getProfileImageBase64());
        }


        // Save the updated CV with all related entities attached
        userCvRepository.save(existingCv);

        return ResponseEntity.ok().body("CV Update Success!");
    }

}
//@PutMapping("/update-cv/{userId}")
//public ResponseEntity<String> updateCv(@PathVariable Long userId,
//                                       @ModelAttribute UserCV updatedUserCV,
//                                       @RequestParam("profileImage") MultipartFile profileImage,
//                                       @RequestParam("dob") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dob) {
//    UserCV existingCv = userCvRepository.findByUserId(userId);
//    if (existingCv == null) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid CV ID");
//    }
//
//    // Update CV fields
//    existingCv.setCvTitle(updatedUserCV.getCvTitle());
//    existingCv.setUpdatedAt(LocalDateTime.now());
//
//    // Handle User Details including dob
//    existingCv.getUserDetails().clear();
//    for (UserDetail detail : updatedUserCV.getUserDetails()) {
//        detail.setUserCV(existingCv);
//        detail.setDob(dob); // Set the date of birth
//        existingCv.getUserDetails().add(detail);
//    }
//
//    // Handle Education
//    existingCv.getUserEducations().clear();
//    for (UserEducation education : updatedUserCV.getUserEducations()) {
//        education.setUserCV(existingCv);
//        existingCv.getUserEducations().add(education);
//    }
//
//    // Handle Experiences
//    existingCv.getUserExperiences().clear();
//    for (UserExperience experience : updatedUserCV.getUserExperiences()) {
//        experience.setUserCV(existingCv);
//        existingCv.getUserExperiences().add(experience);
//    }
//
//    // Handle Skills
//    existingCv.getUserSkills().clear();
//    for (UserSkill skill : updatedUserCV.getUserSkills()) {
//        skill.setUserCV(existingCv);
//        existingCv.getUserSkills().add(skill);
//    }
//
//    // Handle Projects
//    existingCv.getUserProjects().clear();
//    for (UserProject project : updatedUserCV.getUserProjects()) {
//        project.setUserCV(existingCv);
//        existingCv.getUserProjects().add(project);
//    }
//
//    // Handle Languages
//    existingCv.getUserLanguages().clear();
//    for (UserLanguage language : updatedUserCV.getUserLanguages()) {
//        language.setUserCV(existingCv);
//        existingCv.getUserLanguages().add(language);
//    }
//
//    // Handle the profile image upload
//    // Handle the profile image upload
//    if (profileImage != null && !profileImage.isEmpty()) {
//        try {
//            BufferedImage originalImage = ImageIO.read(profileImage.getInputStream());
//
//            // Resize the image to reduce its size
//            int targetWidth = 300; // You can adjust this value
//            int targetHeight = (int) (originalImage.getHeight() * ((double) targetWidth / originalImage.getWidth()));
//            BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
//            resizedImage.createGraphics().drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
//
//            // Convert the resized image to a byte array
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(resizedImage, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//            existingCv.getUserDetails().get(0).setProfileImageBase64(base64Image);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile image");
//        }
//    } else {
//        UserDetail existingDetail = existingCv.getUserDetails().get(0);
//        UserDetail updatedDetail = updatedUserCV.getUserDetails().get(0);
//        updatedDetail.setProfileImageBase64(existingDetail.getProfileImageBase64());
//    }
//
//
//
//    // Save the updated CV with all related entities attached
//    userCvRepository.save(existingCv);
//
//    return ResponseEntity.ok().body("CV Update Success!");
//}
//
//}
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
