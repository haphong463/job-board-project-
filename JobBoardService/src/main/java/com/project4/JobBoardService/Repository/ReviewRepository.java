package Project4.JobBoard.Repository;

import Project4.JobBoard.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review , Long> {
    List<Review> findByCompany_CompanyId(Long companyId);
}
