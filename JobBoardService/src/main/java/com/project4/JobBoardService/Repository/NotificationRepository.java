package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Notification;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User user);
}
