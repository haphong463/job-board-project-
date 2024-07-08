package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.UserDTO;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.payload.PaginatedResponse;
import com.project4.JobBoardService.payload.UserResponse;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import jakarta.annotation.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
                                        @ModelAttribute UserDTO userDTO, @RequestParam("imageFile") @Nullable MultipartFile file,
                                        @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);

            if (!tokenUsername.equals(userDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this user");
            }

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

    @GetMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<?> getAllUser(
            @RequestParam String query,
            @RequestParam @Nullable ERole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> userList;
            if(role == null){
                userList = userService.getAllUsersWithQuery(query ,pageable);
            }else{
                userList = userService.getUsersWithUserRole(role, query, pageable);
            }
            List<UserDTO> userDTOS = userList.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
            PaginatedResponse<UserDTO> response = new PaginatedResponse<>();
            response.setContent(userDTOS);
            response.setCurrentPage(userList.getNumber());
            response.setTotalPages(userList.getTotalPages());
            response.setTotalItems(userList.getTotalElements());
            return ResponseEntity.ok(response);
        }   catch(Exception e)  {
                return ResponseEntity.internalServerError().body("Error load data: " + e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username){
        try {
            User user = userService.findByUsername(username).orElse(null);
            UserDTO userDTOS = modelMapper.map(user, UserDTO.class);
            return ResponseEntity.ok(userDTOS);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error load data: " + e.getMessage());

        }
    }

    @PutMapping("/status/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<?> updateUserEnableStatus(@PathVariable Long id, @RequestBody  Boolean isEnabled){
        try {
            User updateUser = userService.updateUserEnableStatus(id, isEnabled);
            if(updateUser == null) return ResponseEntity.notFound().build();

            UserDTO userDTO = modelMapper.map(updateUser, UserDTO.class);

            return ResponseEntity.ok(userDTO);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


}
