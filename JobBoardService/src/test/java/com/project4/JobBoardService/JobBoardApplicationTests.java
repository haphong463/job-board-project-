package com.project4.JobBoardService;

import com.project4.JobBoardService.Service.BlogCategoryService;
import com.project4.JobBoardService.Service.EmailSenderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;

@SpringBootTest
@ComponentScan(basePackages = {"com.project4.JobBoardService"})
class JobBoardApplicationTests {
    @Autowired
    BlogCategoryService blogCategoryService;

    @Autowired
    EmailSenderService emailSenderService;

    @Test
    void contextLoads() {
		System.out.println("bcs size: " + blogCategoryService.findAll().size());
    }


    @Test
    void sendMail(){
        emailSenderService.sendMail("haphong463@gmail.com", "Test subject", "Test body");
    }
}
