package com.project4.JobBoardService.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "role")
@Data
@EqualsAndHashCode(callSuper=false)
public class Role extends AbstractEntity {

    @Column(length = 40, nullable = false, unique = true)
    private String name;

    @Column(length = 150, nullable = false)
    private String description;
}
