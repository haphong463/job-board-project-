package com.project4.JobBoardService.Config;

import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {
//
//    @Bean
//    public ModelMapper modelMapper() {
//        return new ModelMapper();
//    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        // Add any additional configurations or mappings here

        return modelMapper;
    }

}
