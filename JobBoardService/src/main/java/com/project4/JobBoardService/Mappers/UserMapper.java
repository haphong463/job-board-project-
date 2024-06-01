//package com.project4.JobBoardService.Mappers;
//
//import org.mapstruct.Mapper;
//import org.mapstruct.ReportingPolicy;
//import org.mapstruct.factory.Mappers;
//
//import com.project4.JobBoardService.DTO.UserDTO;
//import com.project4.JobBoardService.Entity.User;
//
//@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
//public interface UserMapper {
//	UserMapper MAPPER = Mappers.getMapper( UserMapper.class );
//
//	UserDTO userToUserDTO(User user);
//
//	//@Mapping(target = "roles", ignore = true)
//	User userDTOToUser(UserDTO userDTO);
//
//}
