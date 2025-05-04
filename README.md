# Insurance Fraud Detection Dashboard

A modern web application for managing insurance claims with fraud detection capabilities. Built with React, TypeScript, Vite, and Tailwind CSS for the frontend, and Java Spring Boot for the backend.

## What the App Does

This application serves as a comprehensive insurance claim management system with built-in fraud detection capabilities. Here's what it enables users to do:

1. **Claim Processing**
   - Submit new insurance claims with detailed information including policyholder details, claim amounts, and incident descriptions
   - Track the status of each claim through its lifecycle
   - View and manage all claims in a centralized dashboard

2. **Fraud Prevention**
   - Automatically flag suspicious claims based on predefined criteria
   - Allow investigators to mark claims as potentially fraudulent
   - Document reasons for fraud suspicion and investigation notes
   - Maintain a separate view of all fraudulent claims for easy monitoring

3. **Data Management**
   - Store and organize claim data efficiently using a robust Java backend
   - Implement soft-delete functionality to maintain data history
   - Restore accidentally deleted claims when needed
   - Search through claims using various criteria (policy number, claimant name, etc.)
   - Secure data persistence using Spring Data JPA and H2 database

4. **Backend Services**
   - RESTful API endpoints for all claim operations
   - Secure data access and manipulation through Spring Security
   - Efficient database operations using Spring Data JPA
   - Transaction management for data consistency
   - Comprehensive error handling and validation
   - Scalable architecture for handling multiple concurrent users

5. **Reporting and Analysis**
   - Generate reports on claim statistics
   - Track fraud patterns and trends
   - Monitor claim processing times and statuses
   - Analyze claim amounts and types

6. **User Experience**
   - Navigate through different claim categories using an intuitive tab interface
   - Search and filter claims in real-time
   - View detailed claim information in a clean, organized layout
   - Perform all operations through a modern, responsive interface

## Features

- **Claim Management**
  - Create, view, update, and delete insurance claims
  - Soft delete functionality with ability to restore deleted claims
  - Search functionality for both active and deleted claims
  - Detailed claim information including policyholder details, amounts, and dates

- **Fraud Detection**
  - Flag suspicious claims as potentially fraudulent
  - Track and manage fraudulent claims separately
  - Add fraud detection reasons and notes

- **User Interface**
  - Modern, responsive design using Tailwind CSS
  - Tab-based navigation for different claim categories
  - Real-time search and filtering
  - Intuitive form validation

## Project Structure

```
src/
├── main/
│   └── java/
│       ├── controller/     # REST API endpoints
│       ├── model/          # Data models
│       ├── repository/     # Database repositories
│       └── service/        # Business logic
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

## Technologies Used

- **Frontend**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Lucide React (Icons)

- **Backend**
  - Spring Boot
  - Spring Data JPA
  - H2 Database (for development)

## Getting Started

1. **Prerequisites**
   - Node.js (v16 or higher)
   - Java JDK (v17 or higher)
   - Maven

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install frontend dependencies
   npm install

   # Start the development server
   npm run dev
   ```

3. **Building for Production**
   ```bash
   # Build the frontend
   npm run build

   # Build and run the backend
   ./mvnw spring-boot:run
   ```

## API Endpoints

- `GET /api/claims` - Get all active claims
- `GET /api/claims/fraudulent` - Get all fraudulent claims
- `GET /api/claims/deleted` - Get all deleted claims
- `GET /api/claims/{id}` - Get claim by ID
- `POST /api/claims` - Create new claim
- `PUT /api/claims/{id}` - Update existing claim
- `DELETE /api/claims/{id}` - Soft delete claim
- `POST /api/claims/{id}/restore` - Restore deleted claim
- `GET /api/claims/search` - Search claims

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.