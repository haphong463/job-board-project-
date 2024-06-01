package com.project4.JobBoardService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
<<<<<<< HEAD
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
=======

>>>>>>> 2cebc32a05936101dea3b05e278c6078584161cd

@SpringBootApplication
@ComponentScan({"com.project4.JobBoardService"})
public class JobBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobBoardApplication.class, args);
	}

<<<<<<< HEAD
//	@Bean
//	PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
=======

>>>>>>> 2cebc32a05936101dea3b05e278c6078584161cd
}
