package com.example.demo.repository;

import com.example.demo.model.Post;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class PostRepository {

    private final Map<Long, Post> storage = new ConcurrentHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(0);

    public PostRepository() {
        seedSampleData();
    }

    private void seedSampleData() {
        save(new Post(
                null,
                "Understanding REST Architecture Principles",
                "REST (Representational State Transfer) is a stateless, client-server architectural style providing uniform resource-based identifiers (URIs) and standard HTTP methods.",
                "Dr. Roy Fielding",
                "Architecture",
                LocalDateTime.now().minusDays(3),
                LocalDateTime.now().minusDays(3)
        ));

        save(new Post(
                null,
                "Layered Architecture in Spring Boot",
                "Spring Boot separates concerns into Controllers (handling HTTP transport), Services (business logic), Repositories (data access), and Domain Entities.",
                "spring.guide@example.com",
                "Spring",
                LocalDateTime.now().minusDays(2),
                LocalDateTime.now().minusDays(2)
        ));

        save(new Post(
                null,
                "Robust Bean Validation with Jakarta Constraints",
                "Bean Validation enforces data integrity before processing reaches domain business logic, returning standardized field-level error messages.",
                "validator@hibernate.org",
                "Validation",
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().minusDays(1)
        ));

        save(new Post(
                null,
                "Distributed Tracing with MDC and Correlation IDs",
                "Mapped Diagnostic Context (MDC) binds unique correlation IDs to thread-local contexts, enabling end-to-end request tracing across microservice boundaries.",
                "observability@devops.org",
                "Observability",
                LocalDateTime.now().minusHours(4),
                LocalDateTime.now().minusHours(4)
        ));
    }

    public List<Post> findAll() {
        return new ArrayList<>(storage.values());
    }

    public Optional<Post> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    public Post save(Post post) {
        if (post.getId() == null) {
            post.setId(idSequence.incrementAndGet());
            if (post.getCreatedAt() == null) {
                post.setCreatedAt(LocalDateTime.now());
            }
        }
        post.setUpdatedAt(LocalDateTime.now());
        storage.put(post.getId(), post);
        return post;
    }

    public boolean deleteById(Long id) {
        return storage.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return storage.containsKey(id);
    }

    public List<Post> findByCategory(String category) {
        return storage.values().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public List<Post> search(String query) {
        if (query == null || query.isBlank()) {
            return findAll();
        }
        String lowerQuery = query.toLowerCase();
        return storage.values().stream()
                .filter(p -> (p.getTitle() != null && p.getTitle().toLowerCase().contains(lowerQuery)) ||
                             (p.getContent() != null && p.getContent().toLowerCase().contains(lowerQuery)) ||
                             (p.getAuthor() != null && p.getAuthor().toLowerCase().contains(lowerQuery)) ||
                             (p.getCategory() != null && p.getCategory().toLowerCase().contains(lowerQuery)))
                .collect(Collectors.toList());
    }

    public long count() {
        return storage.size();
    }
}
