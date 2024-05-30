package com.project4.JobBoardService.Config;

import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new PropertyMap<Blog, BlogResponseDTO>() {
            @Override
            protected void configure() {
                map().getCategory().setId(source.getCategory().getId());
                map().getCategory().setName(source.getCategory().getName());
                map().getUser().setId(source.getUser().getId());
                map().getUser().setUsername(source.getUser().getUsername());
                map().getUser().setEmail(source.getUser().getEmail());
            }
        });

        return modelMapper;
    }
}
