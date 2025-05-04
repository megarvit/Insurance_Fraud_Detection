package repository;

import model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    
    Claim findByClaimId(String claimId);
    
    List<Claim> findByDeletedAtIsNull();
    
    List<Claim> findByDeletedAtIsNullAndIsFraudulentTrue();
    
    List<Claim> findByDeletedAtIsNotNull();
    
    @Query("SELECT c FROM Claim c WHERE c.deletedAt IS NULL AND " +
           "(LOWER(c.claimId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.policyholderName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.policyNumber) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Claim> searchActiveClaims(@Param("query") String query);
    
    @Query("SELECT c FROM Claim c WHERE c.deletedAt IS NOT NULL AND " +
           "(LOWER(c.claimId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.policyholderName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.policyNumber) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Claim> searchDeletedClaims(@Param("query") String query);
} 