package com.example.demo.service;

import com.example.demo.model.LogTrace;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class TraceStorageService {

    private static final int MAX_TRACES = 60;
    private final List<LogTrace> traces = Collections.synchronizedList(new ArrayList<>());

    public void addTrace(LogTrace trace) {
        synchronized (traces) {
            if (traces.size() >= MAX_TRACES) {
                traces.remove(0);
            }
            traces.add(trace);
        }
    }

    public List<LogTrace> getAllTraces() {
        synchronized (traces) {
            List<LogTrace> copy = new ArrayList<>(traces);
            Collections.reverse(copy); // latest first
            return copy;
        }
    }

    public void clearTraces() {
        traces.clear();
    }
}
