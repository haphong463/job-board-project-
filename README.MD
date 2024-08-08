# Job Board Management Project

## Introduction
The Job Board Management Project is a comprehensive web and mobile application designed to facilitate the management and dissemination of job postings. This application allows administrators to create and manage job listings and blog posts related to various job categories, helping job seekers find relevant opportunities and stay informed about industry trends. The repository consists of five projects: **JobBoardApp** (Main application using ReactJS), **JobBoardEmployer** (Employer management using ReactJS), **JobBoardManagement** (Admin management using ReactJS), **JobBoardService** (Backend service using Spring Boot), and **jobboardmobile** (Mobile application using Flutter).

## Features
- **Job Listings Management**: Create, update, delete, and view job postings.
- **Blog Management**: Create, update, delete, and view blog posts associated with specific categories.
- **Category Management**: Organize job listings and blog posts into categories for easier navigation.
- **User Authentication**: Secure access for administrators to manage job postings and blogs.
- **Responsive Design**: User-friendly interface compatible with various devices.

## Technologies Used
- **Backend (JobBoardService)**: Java, Spring Boot, Hibernate, JPA, MySQL, Lombok, Jakarta Persistence.
- **Web Frontend (JobBoardApp, JobBoardEmployer, JobBoardManagement)**: ReactJS, Redux, Axios, React Router, Material-UI.
- **Mobile Frontend (jobboardmobile)**: Flutter.

## Installation and Setup
To set up the Job Board Management Project, you need to have the following prerequisites installed: JDK 11 or later, Maven, MySQL, Node.js and npm (or Yarn), and Flutter SDK. 

### Backend Setup (JobBoardService)
1. Clone the Repository: `git clone https://github.com/haphong463/job-board-project && cd job-board-project/JobBoardService`.
2. Configure MySQL Database: Update the `application.properties` file with your MySQL database credentials: 
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/job_board_db
    spring.datasource.username=root
    spring.datasource.password=yourpassword
    ```
3. Build and Run the Application: `mvn clean install && mvn spring-boot:run`.

### Web Frontend Setup (JobBoardApp, JobBoardEmployer, JobBoardManagement)
1. Clone the Repository: `git clone https://github.com/haphong463/job-board-project && cd job-board-project/JobBoardApp`.
2. Install Dependencies: `npm install`.
3. Start the Application: `npm start`.

### Mobile Frontend Setup (jobboardmobile)
1. Clone the Repository: `git clone https://github.com/haphong463/job-board-project && cd job-board-project/jobboardmobile`.
2. Install Dependencies: `flutter pub get`.
3. Run the Application: `flutter run`.

We welcome contributions to enhance the functionality of this project. Please fork the repository and create a pull request with your changes. This project is licensed under the MIT License. See the LICENSE file for details.

