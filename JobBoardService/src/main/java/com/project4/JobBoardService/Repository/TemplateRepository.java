package com.project4.JobBoardService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project4.JobBoardService.Entity.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {

}
