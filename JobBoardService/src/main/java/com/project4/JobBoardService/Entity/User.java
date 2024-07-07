package com.project4.JobBoardService.Entity;


import com.project4.JobBoardService.Enum.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

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
    @Size(max = 50)
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
    private String imageUrl;
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isEnabled;
    private String thumbnailUrl;
    private String bio;
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
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes = new ArrayList<>();
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
        public User(Long id) {
        this.id = id;
    }



    @ManyToMany
    @JoinTable(
            name = "user_completed_quizzes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "quiz_id")
    )
    private Set<Quiz> completedQuizzes = new HashSet<>();


    public Set<Quiz> getCompletedQuizzes() {
        return completedQuizzes;
    }

    public void setCompletedQuizzes(Set<Quiz> completedQuizzes) {
        this.completedQuizzes = completedQuizzes;
    }

    public void addCompletedQuiz(Quiz quiz) {
        this.completedQuizzes.add(quiz);
    }
}


