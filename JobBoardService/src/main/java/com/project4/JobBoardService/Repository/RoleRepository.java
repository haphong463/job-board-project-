package com.project4.JobBoardService.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project4.JobBoardService.Entity.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {

}