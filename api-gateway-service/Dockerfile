# STAGE 1: Build the Application
# We use a Maven image to build the app from source
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies (Layer Caching)
# This step is separate so we don't re-download dependencies if only code changes
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the actual source code
COPY src ./src

# Build the jar file (skip tests here to speed up builds, tests should be in CI pipeline)
RUN mvn clean package -DskipTests

# -----------------------------------------------------------------------------

# STAGE 2: Run the Application
# We use a smaller, lightweight Java Runtime image for the actual running app
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy only the built JAR file from the "build" stage above
# Note: The JAR name might vary based on your pom.xml version. 
# Using a wildcard (*.jar) or renaming it in pom.xml is safer.
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8083

# The command to start the app
ENTRYPOINT ["java", "-jar", "app.jar"]