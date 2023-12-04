# Getting Started with API Gateway

## Prerequisites

- Install Java. Follow
  the [guide](https://www.codejava.net/java-se/download-and-install-openjdk-17#:~:text=How%20to%20Download%20and%20Install%20OpenJDK%2017%201,...%202%202.%20Install%20OpenJDK%2017%20on%20Windows)
  to install Java on Windows.
- Install Maven. Follow the [guide](https://phoenixnap.com/kb/install-maven-windows) to install Maven on Windows.
- In the project directory, open a command prompt and run the following command (only once):
  ```bash
  mvn clean package
  ```
- Run the following commands to start the application (every time when you want to start the server).

  ```cmd
  set SERVICE_REGISTRY_URL=http://localhost:8761/eureka/
  ```

  ```cmd
  set HOST=localhost
  ```

  ```bash
  java -jar target/ApiGateway.jar
  ```
