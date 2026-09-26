package com.example.demo.service;

import com.example.demo.dto.PostRequest;
import com.example.demo.model.Post;

import java.util.List;

public interface PostService {
    List<Post> getAllPosts(String category, String search);
    Post getPostById(Long id);
    Post createPost(PostRequest request);
    Post updatePost(Long id, PostRequest request);
    void deletePost(Long id);
}
