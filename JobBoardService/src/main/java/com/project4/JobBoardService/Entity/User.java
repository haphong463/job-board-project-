package com.project4.JobBoardService.Entity;


import com.project4.JobBoardService.Enum.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User   {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;
    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotBlank
    @Size(max = 120)
    private String password;
    private String resetToken;
    private boolean verified;

    private String verificationCode;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToMany(mappedBy = "id")
    private Set<Blog> blogs = new HashSet<>();

    @OneToMany(mappedBy = "id")
    private List<Comment> comments;

    @OneToMany(mappedBy = "id")
    private List<Notification> notifications;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCV> userCVs;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Employer employer;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public User(String username, String email, String firstName, String lastName, String password,  Gender gender ) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.gender = gender;
    }
}
