# Restaurant Backend Application

This is a backend application for managing a restaurant's operations. It is built using Java and Spring Boot.

## Features

- Manage menu items
- Create and manage orders
- Handle HTTP requests related to restaurant operations

## Technologies Used

- Java
- Spring Boot
- Maven
- JPA (Java Persistence API)

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd restaurant-backend
   ```

3. Build the project using Maven:
   ```
   mvn clean install
   ```

4. Run the application:
   ```
   mvn spring-boot:run
   ```

## API Endpoints

- `GET /menu` - Retrieve the menu
- `POST /order` - Create a new order
- `GET /order/{id}` - Retrieve an order by ID

## License

This project is licensed under the MIT License.