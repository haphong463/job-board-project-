package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected int id;

    @Temporal(TemporalType.TIMESTAMP)
    protected Date created_at;

    @Temporal(TemporalType.TIMESTAMP)
    protected Date updated_at;

    @PrePersist
    protected void onCreate(){
        created_at = new Date();
        updated_at = new Date();
    }

    @PreUpdate
    protected void onUpdate(){
        updated_at = new Date();
    }

}
