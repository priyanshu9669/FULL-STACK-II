@echo off
title Benchmark Runner - Experiment 6
color 0a

echo =====================================================================
echo    EXPERIMENT 6: PERFORMANCE BENCHMARK RUNNER
echo =====================================================================
echo.
echo Running automated benchmark against http://localhost:8080/api/benchmark/compare ...
echo.

powershell -Command "try { $res = Invoke-RestMethod -Uri 'http://localhost:8080/api/benchmark/compare?iterations=50' -Method Get -TimeoutSec 15; Write-Host '================================================================' -ForegroundColor Cyan; Write-Host '                   BENCHMARK TEST RESULTS                       ' -ForegroundColor Yellow; Write-Host '================================================================' -ForegroundColor Cyan; Write-Host ('Total Requests Tested : ' + $res.totalRequestsTested); Write-Host ('Uncached Avg Latency  : ' + $res.uncachedAverageLatencyMs + ' ms'); Write-Host ('Cached Avg Latency    : ' + $res.cachedAverageLatencyMs + ' ms'); Write-Host ('Speedup Gain          : ' + $res.speedupMultiplier + 'x FASTER') -ForegroundColor Green; Write-Host ('Uncached Throughput   : ' + $res.uncachedThroughputReqSec + ' req/sec'); Write-Host ('Cached Throughput     : ' + $res.cachedThroughputReqSec + ' req/sec') -ForegroundColor Green; Write-Host ('Uncached Error Rate   : ' + $res.uncachedErrorRatePercentage + '%'); Write-Host ('Cached Error Rate     : ' + $res.cachedErrorRatePercentage + '%'); Write-Host '================================================================' -ForegroundColor Cyan; Write-Host $res.summary.speedupImprovement -ForegroundColor Green; } catch { Write-Host '[ERROR] Could not connect to application. Make sure Spring Boot is running first (double-click run.bat).' -ForegroundColor Red; }"

echo.
pause
