package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String claimId;
    
    private String policyholderName;
    private String policyNumber;
    private String claimType;
    private Double amount;
    private String description;
    private LocalDateTime incidentDate;
    private LocalDateTime claimDate;
    private String status;
    private Boolean isFraudulent;
    private String fraudReason;
    private LocalDateTime deletedAt;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getClaimId() {
        return claimId;
    }
    
    public void setClaimId(String claimId) {
        this.claimId = claimId;
    }
    
    public String getPolicyholderName() {
        return policyholderName;
    }
    
    public void setPolicyholderName(String policyholderName) {
        this.policyholderName = policyholderName;
    }
    
    public String getPolicyNumber() {
        return policyNumber;
    }
    
    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }
    
    public String getClaimType() {
        return claimType;
    }
    
    public void setClaimType(String claimType) {
        this.claimType = claimType;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getIncidentDate() {
        return incidentDate;
    }
    
    public void setIncidentDate(LocalDateTime incidentDate) {
        this.incidentDate = incidentDate;
    }
    
    public LocalDateTime getClaimDate() {
        return claimDate;
    }
    
    public void setClaimDate(LocalDateTime claimDate) {
        this.claimDate = claimDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Boolean getIsFraudulent() {
        return isFraudulent;
    }
    
    public void setIsFraudulent(Boolean isFraudulent) {
        this.isFraudulent = isFraudulent;
    }
    
    public String getFraudReason() {
        return fraudReason;
    }
    
    public void setFraudReason(String fraudReason) {
        this.fraudReason = fraudReason;
    }
    
    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }
    
    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
} 