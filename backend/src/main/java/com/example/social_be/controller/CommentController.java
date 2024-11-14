package com.example.social_be.controller;

import com.example.social_be.model.collection.CommentCollection;
import com.example.social_be.model.collection.PostCollection;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.CommentRepository;
import com.example.social_be.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin("https://penguin-brown-eight.vercel.app/")
public class CommentController {

  @Autowired
  private CommentRepository commentRepository;
  @Autowired
  private PostRepository postRepository;

  @GetMapping("/{id}")
  public ResponseEntity<?> getAllComment(@PathVariable String id, @RequestParam("page") String page) {
    Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createAt").descending());
    return ResponseEntity.ok(commentRepository.findAllByPostId(id, pageable));
  }
}
