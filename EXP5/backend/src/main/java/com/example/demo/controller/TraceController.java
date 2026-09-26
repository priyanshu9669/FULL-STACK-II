package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.LogTrace;
import com.example.demo.service.TraceStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for Assignment 5: Observability and Correlation ID Tracing
 * Allows client and evaluation suites to verify request traces and execution times.
 */
@RestController
@RequestMapping("/api/traces")
public class TraceController {

    private final TraceStorageService traceStorageService;

    public TraceController(TraceStorageService traceStorageService) {
        this.traceStorageService = traceStorageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LogTrace>>> getRecentTraces() {
        List<LogTrace> traces = traceStorageService.getAllTraces();
        return ResponseEntity.ok(ApiResponse.success(traces, "Recent execution traces fetched successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearTraces() {
        traceStorageService.clearTraces();
        return ResponseEntity.ok(ApiResponse.success("All cached traces cleared", "Traces cleared"));
    }
}
