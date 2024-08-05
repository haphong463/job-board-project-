package com.project4.JobBoardService.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000", "http://localhost:3001", "https://job-board-project-chi.vercel.app" ,"http://192.168.1.17:8080")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH")
                        .allowedHeaders("*");

            }
        };
    }



    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Đảm bảo rằng "uploads" khớp với đường dẫn bạn đã đặt trong application.properties
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/src/main/resources/uploads/");
    }
}
