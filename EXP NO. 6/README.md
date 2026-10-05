# Unit 2: Experiment 6 - Scalable Read APIs with Caching & Optimization

> **Spring Boot 3 | Java 24/17 | Spring Data JPA | Ehcache 3 | H2 In-Memory DB | Apache JMeter**

---

## 📋 Overview / विवरण

Modern applications (like social media platforms and analytics dashboards) are **read-heavy** systems. Unlike write-heavy systems, read-heavy architectures must prioritize **low latency, high throughput, and optimized data retrieval**.

Yeh project aapke college lab manual (**Unit 2 Experiment 6: Scalable Read APIs with Caching & Optimization**) ke sabhi topics aur 5 assignments ko 100% complete aur working form me implement karta hai.

Is project me ek **Interactive Visual Web Dashboard** (`http://localhost:8080`) bhi shamil hai jisme aap saare features live click karke dekh sakte hain aur lab viva/evaluation me demo de sakte hain.

---

## 🎯 Features & Assignments Implemented (PDF Mapping)

| Assignment / Feature | Description | Implementation Details |
| :--- | :--- | :--- |
| **Assignment 1: Pagination API** | Large datasets ko chunks me efficiently read karna | `GET /api/posts?page=0&size=10&sort=createdAt,desc`<br>Uses `@PageableDefault(size = 10, sort = "createdAt")` |
| **Assignment 2: Fix N+1 Problem** | 1 query for posts + N queries for comments issue ko eliminate karna | `GET /api/posts/with-comments`<br>Uses `@Query("SELECT DISTINCT p FROM Post p JOIN FETCH p.comments")` |
| **Assignment 3: Caching with Ehcache** | Expensive analytics aggregation aur posts ko RAM me cache karna | `GET /api/analytics` & `GET /api/posts/cached`<br>Uses `@Cacheable("analytics")` & `@Cacheable("posts")` with Ehcache 3 |
| **Assignment 4: Native SQL Query** | Database-level direct execution se top-performing posts nikalna | `GET /api/posts/top`<br>Uses `@Query(value = "SELECT * FROM posts ORDER BY likes DESC LIMIT 5", nativeQuery = true)` |
| **Assignment 5: Performance Benchmarking** | Response Time, Throughput, aur Error Rate measure karna before/after caching | Apache JMeter Test Plan (`Experiment6_Benchmarking_Plan.jmx`) + In-app automated benchmark (`/api/benchmark/compare`) |
| **JPQL Query Optimization** | Entity model navigation se author-based filtering | `GET /api/posts/author/{authorId}`<br>Uses `@Query("SELECT p FROM Post p WHERE p.author.id = :authorId")` |
| **Payload Size Optimization** | Response JSON ko compact DTOs me transform karna | `GET /api/posts/optimized`<br>Uses `PostSummaryDto` |
| **Database Indexing** | Fast search aur sorting ke liye B-Tree indexes | `@Index(name = "idx_post_created_at", columnList = "createdAt")`<br>`@Index(name = "idx_post_likes", columnList = "likes")` |

---

## 📁 Project Folder Structure

```
scalable-read-apis/
│
├── .mvn/
│   └── (portable maven wrapper)
├── .vscode/
│   ├── launch.json              # VS Code F5 Run/Debug config
│   ├── tasks.json               # VS Code build and run tasks
│   ├── settings.json            # Java & Maven workspace settings
│   └── extensions.json          # Recommended extensions (Java & Spring)
│
├── jmeter/
│   ├── Experiment6_Benchmarking_Plan.jmx  # Ready-to-use JMeter Test Plan
│   └── jmeter_guide.md                    # JMeter step-by-step tutorial
│
├── src/
│   ├── main/
│   │   ├── java/com/experiment6/scalablereadapis/
│   │   │   ├── config/
│   │   │   │   ├── CacheConfig.java        # Ehcache / JCache setup (@EnableCaching)
│   │   │   │   └── DataInitializer.java    # Seeds 50 posts, 5 authors, 173 comments
│   │   │   ├── controller/
│   │   │   │   ├── PostController.java     # Pagination, Sorting, N+1 demo, Native SQL
│   │   │   │   ├── AnalyticsController.java # Cached Analytics endpoints
│   │   │   │   └── BenchmarkController.java # Automated performance benchmark
│   │   │   ├── dto/                        # Clean DTOs for payload optimization
│   │   │   ├── entity/                     # Author, Post, Comment, Analytics entities
│   │   │   ├── repository/                 # Spring Data JPA Repositories
│   │   │   ├── service/                    # Business logic & Cache implementations
│   │   │   └── ScalableReadApisApplication.java # Spring Boot Main Class
│   │   │
│   │   └── resources/
│   │       ├── application.properties      # H2 DB & Ehcache configuration
│   │       ├── ehcache.xml                 # Ehcache 3 heap & TTL settings
│   │       └── static/                     # Web UI Dashboard (HTML, CSS, JS)
│   │           ├── index.html
│   │           ├── styles.css
│   │           └── app.js
│   │
│   └── test/
│       └── java/com/experiment6/scalablereadapis/
│           └── ScalableReadApisApplicationTests.java # 5 Automated Tests for All Assignments
│
├── mvnw.cmd                             # Portable Maven wrapper script
├── run.bat                              # 1-Click launcher for Windows
├── benchmark.bat                        # Console benchmark script
├── pom.xml                              # Maven build config (Spring Boot 3.3.4)
└── README.md
```

---

## 🚀 How to Run in VS Code (Step-by-Step)

### Option 1: Double Click `run.bat` (Sabse Aasan Tarika)
1. Project folder me jaao: `C:\Users\singh\.gemini\antigravity\scratch\scalable-read-apis`
2. **`run.bat`** file par double click karo.
3. Yeh automatically:
   - Java check karega
   - Spring Boot application build aur start karega
   - Aapke default browser me `http://localhost:8080` open kar dega!

---

### Option 2: VS Code me Chalana

1. **VS Code Open karo:**
   - File -> **Open Folder** -> Select karo:
     `C:\Users\singh\.gemini\antigravity\scratch\scalable-read-apis`
2. **VS Code Terminal se Run karein:**
   - Terminal menu kholo (`Ctrl + ~`)
   - Type karo:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - Server start ho jayega!
3. **Ya VS Code Run & Debug (F5) use karein:**
   - Left sidebar me "Run and Debug" icon par click karein.
   - **"Spring Boot - ScalableReadApisApplication"** select karke `F5` dabayein.
4. Browser me open karein:
   - **Dashboard:** [http://localhost:8080](http://localhost:8080)
   - **H2 Database Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
     - *JDBC URL:* `jdbc:h2:mem:experiment6db`
     - *Username:* `sa`
     - *Password:* (leave empty)

---

## 🧪 Testing All 5 Assignments

### 1. Assignment 1: Pagination & Sorting
- **Web UI:** Open Tab 1 ("Pagination & Sorting").
  - Dropdown se select karein: `Page Size: 10`, `Sort: Most Liked (likes DESC)`.
  - Next / Previous page buttons dabayein.
- **REST API Call:**
  ```bash
  curl "http://localhost:8080/api/posts?page=0&size=5&sort=likes,desc"
  ```
- **Code Reference:**
  ```java
  @GetMapping("/posts")
  public Page<Post> getPosts(
      @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
      return postRepository.findAll(pageable);
  }
  ```

---

### 2. Assignment 2: Fix N+1 Problem (JOIN FETCH)
- **Web UI:** Open Tab 2 ("Fix N+1").
  - Click **"Run Live Comparison Test"**.
  - **Left side (Unoptimized):** Shows 1 query to fetch posts + 10 individual queries to fetch comments = **11 queries total**.
  - **Right side (Optimized JOIN FETCH):** Shows **1 single query** fetching both posts and comments in one database trip!
- **REST API Call:**
  ```bash
  # Unoptimized vs Optimized Comparison:
  curl "http://localhost:8080/api/posts/n-plus-one-demo"

  # Direct JOIN FETCH endpoint:
  curl "http://localhost:8080/api/posts/with-comments"
  ```
- **Code Reference:**
  ```java
  @Query("SELECT DISTINCT p FROM Post p JOIN FETCH p.comments")
  List<Post> findAllWithComments();
  ```

---

### 3. Assignment 3: In-Memory Caching with Ehcache
- **Web UI:** Open Tab 3 ("Ehcache & Analytics").
  - 1st click on **"Fetch Analytics"**: Shows `CACHE MISS` (~200ms latency, database calculation).
  - 2nd click on **"Fetch Analytics"**: Shows `CACHE HIT` (~1ms latency, 99.5% reduction!).
  - Click **"Evict Cache"** to clear the cache and test again.
- **REST API Call:**
  ```bash
  # Fetch Analytics (Cached)
  curl "http://localhost:8080/api/analytics"

  # Evict Analytics Cache
  curl -X POST "http://localhost:8080/api/analytics/cache/evict"
  ```
- **Code Reference:**
  ```java
  @Cacheable(value = "analytics", key = "'dashboardAnalytics'")
  public Analytics getAnalytics() {
      return computeAnalytics();
  }
  ```

---

### 4. Assignment 4: Native SQL Query
- **Web UI:** Open Tab 4 ("Native SQL Query").
  - Click **"Fetch Top 5 Posts"**.
  - Displays the 5 highest-liked posts executed directly on the database engine.
- **REST API Call:**
  ```bash
  curl "http://localhost:8080/api/posts/top"
  ```
- **Code Reference:**
  ```java
  @Query(value = "SELECT * FROM posts ORDER BY likes DESC LIMIT 5", nativeQuery = true)
  List<Post> findTopPosts();
  ```

---

### 5. Assignment 5: Performance Benchmarking (JMeter & Load Test)
- **Automated Console Test:**
  - Double click **`benchmark.bat`** or run in terminal:
    ```powershell
    .\benchmark.bat
    ```
  - Output displays Before vs After Caching latency, speedup gain, throughput, and error rates!
- **In-App Dashboard Test:**
  - Go to Tab 5 ("JMeter & Benchmark") in your browser.
  - Click **"Run In-App Load Benchmark (50 Requests)"**.
- **Apache JMeter Test Plan:**
  - File: `jmeter/Experiment6_Benchmarking_Plan.jmx`
  - Run command:
    ```bash
    jmeter -n -t jmeter/Experiment6_Benchmarking_Plan.jmx -l results.csv -e -o ./report
    ```

---

## 🛠️ Automated Unit & Integration Tests

Sabhi assignments ke automated tests pre-configured hain. Inhe run karne ke liye terminal me type karein:

```powershell
.\mvnw.cmd test
```

Result:
```
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 🎓 Academic Viva Questions & Answers

1. **What is the N+1 problem and how does JOIN FETCH solve it?**
   - *Answer:* When fetching a collection of entities, standard lazy loading executes 1 query for the parent list, and then N queries for each parent's children. `JOIN FETCH` forces Hibernate to use an SQL `INNER JOIN` or `LEFT JOIN` to fetch parents and children in a single round trip.
2. **Why do we need pagination in read APIs?**
   - *Answer:* Loading thousands of records at once leads to high memory consumption, high network payload, and high database execution cost. `Pageable` limits retrieval using SQL `LIMIT` and `OFFSET` (or `FETCH FIRST n ROWS ONLY`).
3. **What is the benefit of Native SQL queries over JPQL?**
   - *Answer:* JPQL must be translated to SQL by Hibernate, adding overhead. Native queries execute directly on the database engine, allowing specific database optimizations and indexes.
4. **How does Ehcache improve read API performance?**
   - *Answer:* Ehcache stores frequently requested data in local RAM (in-memory heap). Repeated queries hit the cache instead of the database, dropping latency from hundreds of milliseconds to 1 millisecond.
