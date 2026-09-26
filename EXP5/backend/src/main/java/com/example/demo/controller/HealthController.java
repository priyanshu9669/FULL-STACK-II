package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRootInfo() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "Spring Boot REST API Backend");
        info.put("backendPort", 8080);
        info.put("status", "ACTIVE");
        info.put("frontendUrl", "http://localhost:5173");
        info.put("note", "Backend and Frontend run on separate servers. Open http://localhost:5173 in your browser for the user interface.");
        info.put("endpoints", Map.of(
                "posts", "http://localhost:8080/api/posts",
                "health", "http://localhost:8080/api/health",
                "traces", "http://localhost:8080/api/traces"
        ));
        return ResponseEntity.ok(ApiResponse.success(info, "Backend server is running on port 8080. Frontend runs on separate server http://localhost:5173"));
    }

    @GetMapping("/api/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("status", "UP");
        info.put("experiment", "Experiment 5 - Spring Boot REST API Design & Exception Handling");
        info.put("unit", "Unit 2");
        info.put("architecture", "Layered Architecture (Controller -> Service -> Repository -> Database)");
        info.put("assignments", Map.of(
                "assignment1", "Consistent response structure (ApiResponse<T>)",
                "assignment2", "Bean Validation (@Valid, @NotBlank, @Size, @Pattern)",
                "assignment3", "Logging Filter (OncePerRequestFilter with URI and execution duration)",
                "assignment4", "Global Exception Handler (@RestControllerAdvice)",
                "assignment5", "Correlation ID Tracing (SLF4J MDC, X-Correlation-ID header)"
        ));

        return ResponseEntity.ok(ApiResponse.success(info, "Service is healthy and fully operational"));
    }
}
