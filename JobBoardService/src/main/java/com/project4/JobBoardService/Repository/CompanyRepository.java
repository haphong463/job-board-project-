package Project4.JobBoard.Repository;

import Project4.JobBoard.Entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
