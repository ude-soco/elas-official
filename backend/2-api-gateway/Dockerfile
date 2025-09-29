# syntax=docker/dockerfile:1.6
FROM maven:3-eclipse-temurin-24 as build
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn --no-transfer-progress package


FROM eclipse-temurin:25-jre
COPY --from=build /target/*.jar .
USER 65534
EXPOSE 8000
CMD ["java", "-jar", "ApiGateway.jar"]
