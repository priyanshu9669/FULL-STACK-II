package com.example.demo.filter;

import com.example.demo.model.LogTrace;
import com.example.demo.service.TraceStorageService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Assignment 3: Logging Filter - Logs request URI and execution time
 * Assignment 5: Advanced Correlation ID - Adds correlation ID using MDC and propagates via headers
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationAndLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(CorrelationAndLoggingFilter.class);
    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String CORRELATION_ID_KEY = "correlationId";
    public static final String EXECUTION_TIME_HEADER = "X-Execution-Time-Ms";

    private final TraceStorageService traceStorageService;

    public CorrelationAndLoggingFilter(TraceStorageService traceStorageService) {
        this.traceStorageService = traceStorageService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Assignment 5: Extract or generate Correlation ID
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.trim().isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }

        // 2. Add correlationId to SLF4J Mapped Diagnostic Context (MDC)
        MDC.put(CORRELATION_ID_KEY, correlationId);

        // 3. Attach correlation ID to response headers
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        // 4. Assignment 3: Start execution timer
        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString() != null ? "?" + request.getQueryString() : "";
        String fullPath = uri + queryString;
        String clientIp = getClientIp(request);

        // Assignment 3: Log incoming request URI
        logger.info("--> [START REQUEST] Method: {}, URI: {}, Client IP: {}", method, fullPath, clientIp);

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Assignment 3: Calculate execution duration
            long executionTimeMs = System.currentTimeMillis() - startTime;
            response.setHeader(EXECUTION_TIME_HEADER, String.valueOf(executionTimeMs));

            int statusCode = response.getStatus();
            
            // Assignment 3: Log response details with execution time and URI
            logger.info("<-- [END REQUEST] Method: {}, URI: {}, Status: {}, Execution Time: {}ms",
                    method, fullPath, statusCode, executionTimeMs);

            // Record trace for live UI verification (exclude trace API itself to avoid recursion)
            if (!uri.startsWith("/api/traces") && !uri.endsWith(".ico") && !uri.endsWith(".png") && !uri.endsWith(".js") && !uri.endsWith(".css")) {
                LogTrace trace = new LogTrace(
                        UUID.randomUUID().toString(),
                        correlationId,
                        method,
                        fullPath,
                        statusCode,
                        executionTimeMs,
                        LocalDateTime.now(),
                        clientIp,
                        String.format("%s %s -> %d (%d ms)", method, fullPath, statusCode, executionTimeMs)
                );
                traceStorageService.addTrace(trace);
            }

            // Clean up MDC to prevent leakage across pooled threads
            MDC.remove(CORRELATION_ID_KEY);
            MDC.clear();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
