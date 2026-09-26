package com.example.demo.service;

import com.example.demo.dto.PostRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);
    private final PostRepository postRepository;

    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public List<Post> getAllPosts(String category, String search) {
        if (category != null && !category.isBlank()) {
            return postRepository.findByCategory(category);
        }
        if (search != null && !search.isBlank()) {
            return postRepository.search(search);
        }
        return postRepository.findAll();
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
    }

    @Override
    public Post createPost(PostRequest request) {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setCategory(request.getCategory());

        Post saved = postRepository.save(post);

        // Prominent console output for student verification
        System.out.println("\n=======================================================");
        System.out.println(">>> [BACKEND DATABASE] NEW POST CREATED SUCCESSFULLY!");
        System.out.println("    ID       : " + saved.getId());
        System.out.println("    Title    : " + saved.getTitle());
        System.out.println("    Author   : " + saved.getAuthor());
        System.out.println("    Category : " + saved.getCategory());
        System.out.println("    Content  : " + saved.getContent());
        System.out.println("    Total Posts in Memory: " + postRepository.count());
        System.out.println("=======================================================\n");

        logger.info("Successfully persisted post ID {} with title '{}'", saved.getId(), saved.getTitle());
        return saved;
    }

    @Override
    public Post updatePost(Long id, PostRequest request) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        existingPost.setAuthor(request.getAuthor());
        existingPost.setCategory(request.getCategory());

        Post updated = postRepository.save(existingPost);

        System.out.println("\n>>> [BACKEND DATABASE] POST #" + id + " UPDATED: " + updated.getTitle() + "\n");
        logger.info("Successfully updated post id: {}", updated.getId());
        return updated;
    }

    @Override
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Post", "id", id);
        }
        postRepository.deleteById(id);
        System.out.println("\n>>> [BACKEND DATABASE] POST #" + id + " DELETED. Remaining posts: " + postRepository.count() + "\n");
        logger.info("Post id: {} successfully removed from repository", id);
    }
}
