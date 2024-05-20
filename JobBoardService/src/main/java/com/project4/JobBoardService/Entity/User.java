package com.project4.JobBoardService.Entity;

import com.project4.JobBoardService.Enum.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User extends AbstractEntity {
    @Column(length = 64, nullable = false, unique = true)
    @Email
    private String email;

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

    @Column(length = 1024)
    private String photo;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean enabled;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean changePassword;

    @Column(name = "reset_password_token", length = 128)
    private String resetPasswordToken;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();


    @OneToMany(mappedBy = "id")
    private Set<Blog> blogs = new HashSet<>();

    public void addRole(Role role) {
        this.roles.add(role);
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gender=" + gender +
                ", photo='" + photo + '\'' +
                ", enabled=" + enabled +
                ", changePassword=" + changePassword +
                ", resetPasswordToken='" + resetPasswordToken + '\'' +
                ", roles=" + roles +
                '}';
    }

//    @Transient
//    public String getPhotosImagePath() {
//        if (id == null || photo == null)
//            return "/images/default-user.png";
//
//        return "/user-photos/" + this.id + "/" + photo;
//    }

    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Transient
    public boolean hasRole(String roleName) {
        if (roleName == null) {
            return false;
        }
        for (Role role : roles) {
            if (roleName.equals(role.getName())) {
                return true;
            }
        }
        return false;
    }

}
