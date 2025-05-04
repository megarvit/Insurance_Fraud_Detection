package controller;

import main.model.Claim;
import main.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @GetMapping
    public List<Claim> getAllActiveClaims() {
        return claimService.getAllActiveClaims();
    }

    @GetMapping("/fraudulent")
    public List<Claim> getAllFraudulentClaims() {
        return claimService.getAllFraudulentClaims();
    }

    @GetMapping("/deleted")
    public List<Claim> getAllDeletedClaims() {
        return claimService.getAllDeletedClaims();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        Claim claim = claimService.getClaimById(id);
        if (claim != null) {
            return ResponseEntity.ok(claim);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Claim createClaim(@RequestBody Claim claim) {
        return claimService.saveClaim(claim);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaim(@PathVariable Long id, @RequestBody Claim claim) {
        Claim existingClaim = claimService.getClaimById(id);
        if (existingClaim != null) {
            claim.setId(id);
            return ResponseEntity.ok(claimService.saveClaim(claim));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restoreClaim(@PathVariable Long id) {
        claimService.restoreClaim(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public List<Claim> searchClaims(@RequestParam String query, @RequestParam(required = false) Boolean includeDeleted) {
        if (includeDeleted != null && includeDeleted) {
            return claimService.searchDeletedClaims(query);
        }
        return claimService.searchActiveClaims(query);
    }
} 