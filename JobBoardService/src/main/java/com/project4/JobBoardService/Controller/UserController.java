package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogDTO;
import com.project4.JobBoardService.DTO.UserDTO;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @ModelAttribute UserDTO userDTO, @RequestParam("imageFile") MultipartFile file,
                                        @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);

            if (!tokenUsername.equals(userDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this user");
            }

            // ! Check existing user
            if (userService.findById(id).orElse(null) == null) {
                return ResponseEntity.notFound().build();
            }

            User user = modelMapper.map(userDTO, User.class);
            User result = userService.updateUser(id, user, file);

            UserDTO resultDTO = modelMapper.map(result, UserDTO.class);
            return ResponseEntity.ok(resultDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
