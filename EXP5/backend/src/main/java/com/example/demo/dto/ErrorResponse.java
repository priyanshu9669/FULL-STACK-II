package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.slf4j.MDC;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private boolean success = false;
    private String message;
    private String errorCode;
    private int statusCode;
    private Map<String, String> validationErrors;
    private String correlationId;
    private LocalDateTime timestamp;
    private String path;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
        this.correlationId = MDC.get("correlationId");
    }

    public ErrorResponse(String message, String errorCode, int statusCode, String path) {
        this.success = false;
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.path = path;
        this.correlationId = MDC.get("correlationId");
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, String errorCode, int statusCode, Map<String, String> validationErrors, String path) {
        this.success = false;
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.validationErrors = validationErrors;
        this.path = path;
        this.correlationId = MDC.get("correlationId");
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
