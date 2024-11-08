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

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin("http://localhost:3000/")
public class CommentController {

  @Autowired
  private CommentRepository commentRepository;
  @Autowired
  private PostRepository postRepository;

  @GetMapping("/{id}")
  public ResponseEntity<?> getAllComment(@PathVariable String id, @RequestParam("page") String page) {
    Pageable pageable = PageRequest.of(Integer.parseInt(page), 2);
    return ResponseEntity.ok(commentRepository.findAllByPostId(id, pageable));
  }

  @DeleteMapping("/{id}/{postId}")
  @Transactional
  @Async
  public ResponseEntity<?> deleteComment(@PathVariable String id, @PathVariable String postId) {
    CommentCollection comment = commentRepository.findCommentCollectionById(id);
    if (comment == null)
      return ResponseEntity.badRequest().body(new MessageResponse("Comment is deleted"));
    PostCollection post = postRepository.findPostCollectionById(postId);
    long subCommentQuantity = comment.getReply().size() + 1;
    post.setComments(post.getComments() - subCommentQuantity);
    postRepository.save(post);
    commentRepository.deleteCommentCollectionById(id);
    return ResponseEntity.ok(new MessageResponse("ok"));
  }

  @DeleteMapping("/{id}/{postId}/{subCommentId}")
  public ResponseEntity<?> deleteSubComment(@PathVariable String id, @PathVariable String postId,
      @PathVariable String subCommentId) {
    CommentCollection comment = commentRepository.findCommentCollectionById(id);
    if (comment == null)
      return ResponseEntity.badRequest().body(new MessageResponse("Comment is deleted"));
    PostCollection post = postRepository.findPostCollectionById(postId);
    if (subCommentId != null) {
      List<CommentCollection> sub = comment.getReply();
      if (sub.isEmpty())
        return ResponseEntity.badRequest().body(new MessageResponse("Comment is deleted"));
      sub.removeIf(e -> e.getId().equals(subCommentId));
      comment.setReply(sub);
      post.setComments(post.getComments() - 1);
      commentRepository.save(comment);
      postRepository.save(post);
      return ResponseEntity.ok(new MessageResponse("ok"));
    }
    return ResponseEntity.badRequest().body(new MessageResponse("Comment not found"));
  }
}
