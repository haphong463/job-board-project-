package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.InforUserDTO;
import com.project4.JobBoardService.DTO.UserDTO;
import com.project4.JobBoardService.DTO.UserEducationDTO;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserEducation;
import com.project4.JobBoardService.Repository.UserEducationRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.InforService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import jakarta.annotation.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class InforController {
    @Autowired
    private UserService userService;

    @Autowired
    private InforService inforService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    UserEducationRepository userEducationRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    UserRepository userRepository;
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<?> updateUser1(@PathVariable Long id,
                                         @ModelAttribute InforUserDTO inforUserDTO, @RequestParam("imageFile") @Nullable MultipartFile file,
                                         @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);



            if (userService.findById(id).orElse(null) == null) {
                return ResponseEntity.notFound().build();
            }

            User user = modelMapper.map(inforUserDTO, User.class);
            User result = inforService.updateUser1(id, user, file);

            InforUserDTO resultDTO = modelMapper.map(result, InforUserDTO.class);
            return ResponseEntity.ok(resultDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username){
        try {
            User user = inforService.findByUsername(username).orElse(null);
            InforUserDTO userDTOS = modelMapper.map(user, InforUserDTO.class);
            return ResponseEntity.ok(userDTOS);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error load data: " + e.getMessage());

        }
    }
    @GetMapping("/education/{userId}")
    public ResponseEntity<List<UserEducationDTO>> getEducationByUserId(@PathVariable Long userId) {
        List<UserEducation> educations = userEducationRepository.findByUser_Id(userId);
        List<UserEducationDTO> educationDTOs = educations.stream()
                .map(education -> modelMapper.map(education, UserEducationDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(educationDTOs);
    }


}
