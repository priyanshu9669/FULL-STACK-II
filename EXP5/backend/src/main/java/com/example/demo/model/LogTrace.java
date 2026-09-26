package com.example.demo.model;

import java.time.LocalDateTime;

public class LogTrace {
    private String id;
    private String correlationId;
    private String method;
    private String uri;
    private int statusCode;
    private long executionTimeMs;
    private LocalDateTime timestamp;
    private String clientIp;
    private String message;

    public LogTrace() {
    }

    public LogTrace(String id, String correlationId, String method, String uri, int statusCode, long executionTimeMs, LocalDateTime timestamp, String clientIp, String message) {
        this.id = id;
        this.correlationId = correlationId;
        this.method = method;
        this.uri = uri;
        this.statusCode = statusCode;
        this.executionTimeMs = executionTimeMs;
        this.timestamp = timestamp;
        this.clientIp = clientIp;
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
