package com.project4.JobBoardService.Entity;


import com.project4.JobBoardService.Enum.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User   {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 64, nullable = false, unique = true)
    @Email
    private String email;

    private String username;

    @Column(length = 128, nullable = false)
    @NotNull
    private String password;

    @Column(name = "first_name", length = 45, nullable = false)
    @NotNull
    private String firstName;

    @Column(name = "last_name", length = 45, nullable = false)
    @NotNull
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Gender gender;


    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean enabled;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean changePassword;

    private Boolean blocked;


    @Column(name = "reset_password_token", length = 128)
    private String resetPasswordToken;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "id")
    private Set<Blog> blogs = new HashSet<>();

    @OneToMany(mappedBy = "id")
    private List<Comment> comments;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCV> userCVs;

//    @Transient
//    public String getPhotosImagePath() {
//        if (id == null || photo == null)
//            return "/images/default-user.png";
//
//        return "/user-photos/" + this.id + "/" + photo;
//    }


}
