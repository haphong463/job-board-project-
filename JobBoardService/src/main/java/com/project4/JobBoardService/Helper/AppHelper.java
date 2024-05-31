package com.project4.JobBoardService.Helper;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class AppHelper {
	public String getEncodedPassword(String password) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		return encoder.encode(password);
	}
}
