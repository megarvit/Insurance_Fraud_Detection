package service;

import model.Claim;
import repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClaimService {
    
    @Autowired
    private ClaimRepository claimRepository;
    
    public List<Claim> getAllActiveClaims() {
        return claimRepository.findByDeletedAtIsNull();
    }
    
    public List<Claim> getAllFraudulentClaims() {
        return claimRepository.findByDeletedAtIsNullAndIsFraudulentTrue();
    }
    
    public List<Claim> getAllDeletedClaims() {
        return claimRepository.findByDeletedAtIsNotNull();
    }
    
    public Claim getClaimById(Long id) {
        Optional<Claim> claim = claimRepository.findById(id);
        return claim.orElse(null);
    }
    
    public Claim getClaimByClaimId(String claimId) {
        return claimRepository.findByClaimId(claimId);
    }
    
    @Transactional
    public Claim saveClaim(Claim claim) {
        return claimRepository.save(claim);
    }
    
    @Transactional
    public void deleteClaim(Long id) {
        Claim claim = getClaimById(id);
        if (claim != null) {
            claim.setDeletedAt(LocalDateTime.now());
            claimRepository.save(claim);
        }
    }
    
    @Transactional
    public void restoreClaim(Long id) {
        Claim claim = getClaimById(id);
        if (claim != null) {
            claim.setDeletedAt(null);
            claimRepository.save(claim);
        }
    }
    
    public List<Claim> searchActiveClaims(String query) {
        return claimRepository.searchActiveClaims(query);
    }
    
    public List<Claim> searchDeletedClaims(String query) {
        return claimRepository.searchDeletedClaims(query);
    }
} 