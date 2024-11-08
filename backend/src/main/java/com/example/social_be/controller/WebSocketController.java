package com.example.social_be.controller;

import com.example.social_be.model.collection.CommentCollection;
import com.example.social_be.model.collection.MessageCollection;
import com.example.social_be.model.collection.PostCollection;
import com.example.social_be.model.request.CommentRequestSocket;
import com.example.social_be.model.request.MessageRequest;
import com.example.social_be.model.request.MessageRequestSocket;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.CommentRepository;
import com.example.social_be.repository.MessageRepository;
import com.example.social_be.repository.PostRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class WebSocketController {
  @Autowired
  private MessageRepository messageRepository;
  @Autowired
  private CommentRepository commentRepository;
  @Autowired
  private PostRepository postRepository;

  // Handles messages from /app/messages. (Note the Spring adds the /app prefix
  // for us).
  @MessageMapping("/messages/{id}")
  // Sends the return value of this method to /topic/messages
  @SendTo("/topic/messages/{id}")
  public ResponseEntity<?> CDMessage(@DestinationVariable String id, MessageRequestSocket message) {
    if (message.getDeleteMessage() == 1) {
      return ResponseEntity.ok(new MessageResponse(message.getId()));
    }
    MessageCollection _message = new MessageCollection(message.getContent(), message.getUserId(), id);
    return ResponseEntity.ok(messageRepository.save(_message));
  }

  @MessageMapping("/comments/{id}")
  // Sends the return value of this method to /topic/messages
  @SendTo("/topic/comments/{id}")
  @Transactional
  @Async
  public ResponseEntity<?> CDcomment(@DestinationVariable String id, CommentRequestSocket commentRequest) {
    if (commentRequest.getDeleteComment() == 1) {
      if (commentRequest.getSubCommentId() != null) {
        return ResponseEntity.ok(
            new MessageResponse(commentRequest.getId().toString() + " " + commentRequest.getSubCommentId().toString()));
      }
      return ResponseEntity.ok(new MessageResponse(commentRequest.getId()));
    }
    PostCollection post = postRepository.findPostCollectionById(id);
    if (post == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("post was deleted"));
    }
    if (commentRequest.getId() != null) {
      CommentCollection commentExit = commentRepository.findCommentCollectionById(commentRequest.getId());
      List<CommentCollection> reply = commentExit.getReply();
      reply.add(
          new CommentCollection(commentRequest.getUserId(), commentRequest.getAvatar(), commentRequest.getContent(),
              commentRequest.getDisplayName(), commentRequest.getReplyId(), commentRequest.getSubCommentId()));
      commentExit.setReply(reply);
      post.setComments(post.getComments() + 1);
      postRepository.save(post);
      return ResponseEntity.ok(commentRepository.save(commentExit));
    }
    CommentCollection _comment = new CommentCollection(commentRequest.getUserId(), commentRequest.getAvatar(),
        commentRequest.getPostId(), commentRequest.getContent(), commentRequest.getDisplayName());
    post.setComments(post.getComments() + 1);
    postRepository.save(post);
    return ResponseEntity.ok(commentRepository.save(_comment));
  }
}
