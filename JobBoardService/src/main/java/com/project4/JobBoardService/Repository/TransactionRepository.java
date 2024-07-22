package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Subscription;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface TransactionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserAndEndDateAfter(User user, LocalDate date);


    @Query(value = "SELECT * FROM Subscription s WHERE s.user_id = :userId", nativeQuery = true)
    List<Subscription> findAllSubscriptionByUserId(@Param("userId") Long userId);
}
