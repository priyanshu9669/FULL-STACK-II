package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.exception.BadRequestException;
import com.example.demo.model.Post;
import com.example.demo.service.PostService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * HTTP GET: Retrieve all posts
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        List<Post> posts = postService.getAllPosts(category, search);
        System.out.println("[API CONTROLLER] GET /api/posts - Returning " + posts.size() + " posts");
        return ResponseEntity.ok(ApiResponse.success(posts, "Posts fetched successfully"));
    }

    /**
     * HTTP GET: Retrieve post by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(@PathVariable Long id) {
        System.out.println("[API CONTROLLER] GET /api/posts/" + id);
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success(post, "Post found successfully"));
    }

    /**
     * HTTP POST: Create new post with Bean Validation (@Valid)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(@Valid @RequestBody PostRequest request) {
        System.out.println("[API CONTROLLER] POST /api/posts - Received post: '" + request.getTitle() + "' by " + request.getAuthor());
        Post created = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(created, "Post created successfully"));
    }

    /**
     * HTTP PUT: Update post with Bean Validation (@Valid)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {

        System.out.println("[API CONTROLLER] PUT /api/posts/" + id + " - Updating post");
        Post updated = postService.updatePost(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Post updated successfully"));
    }

    /**
     * HTTP DELETE: Remove post by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deletePost(@PathVariable Long id) {
        System.out.println("[API CONTROLLER] DELETE /api/posts/" + id);
        postService.deletePost(id);
        Map<String, Object> data = new HashMap<>();
        data.put("deletedId", id);
        data.put("status", "DELETED");
        return ResponseEntity.ok(ApiResponse.success(data, "Post with id " + id + " has been successfully deleted"));
    }

    /**
     * Assignment 4 Testing: Trigger generic 500 Uncaught Exception
     */
    @GetMapping("/error/trigger-500")
    public ResponseEntity<Void> triggerInternalServerError() {
        System.out.println("[API CONTROLLER] Triggering simulated 500 server error...");
        throw new RuntimeException("Simulated unhandled runtime exception to test Assignment 4 Global 500 Handler!");
    }

    /**
     * Assignment 4 Testing: Trigger custom 400 Bad Request Exception
     */
    @GetMapping("/error/trigger-bad-request")
    public ResponseEntity<Void> triggerBadRequestError() {
        System.out.println("[API CONTROLLER] Triggering simulated 400 Bad Request...");
        throw new BadRequestException("Simulated business rule failure: Category 'Forbidden' cannot be accepted.");
    }
}
