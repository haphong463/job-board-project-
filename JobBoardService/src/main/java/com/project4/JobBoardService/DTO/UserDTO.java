package com.project4.JobBoardService.DTO;
import com.project4.JobBoardService.Enum.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String imageUrl;
    private String bio;
    private Boolean isEnabled;
}
