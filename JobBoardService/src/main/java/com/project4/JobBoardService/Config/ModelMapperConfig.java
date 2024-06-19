package com.project4.JobBoardService.Config;

import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.Entity.Blog;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Define the mapping from Blog to BlogResponseDTO
//        TypeMap<Blog, BlogResponseDTO> typeMap = modelMapper.createTypeMap(Blog.class, BlogResponseDTO.class);
//        typeMap.addMapping(
//                source -> source.getCategories().stream().map(category -> {
//                    BlogCategoryDTO categoryDTO = new BlogCategoryDTO();
//                    categoryDTO.setId(category.getId());
//                    categoryDTO.setName(category.getName());
//                    return categoryDTO;
//                }).collect(Collectors.toList()),
//                BlogResponseDTO::setCategories
//        );
//
//        typeMap.addMapping(Blog::getUser, BlogResponseDTO::setUser);

        return modelMapper;
    }
}
