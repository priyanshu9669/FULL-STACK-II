package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostRequest {

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 2, max = 100, message = "Title must be at least 2 characters")
    private String title;

    @NotBlank(message = "Content cannot be empty")
    @Size(min = 3, max = 1000, message = "Content must be at least 3 characters")
    private String content;

    @NotBlank(message = "Author name cannot be empty")
    private String author;

    private String category = "General";

    public PostRequest() {
    }

    public PostRequest(String title, String content, String author, String category) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = (category != null && !category.isBlank()) ? category : "General";
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = (category != null && !category.isBlank()) ? category : "General";
    }
}
