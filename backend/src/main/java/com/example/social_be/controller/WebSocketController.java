package com.example.social_be.controller;

import com.example.social_be.model.collection.CommentCollection;
import com.example.social_be.model.collection.MessageCollection;
import com.example.social_be.model.collection.PostCollection;
import com.example.social_be.model.request.CommentRequestSocket;
import com.example.social_be.model.request.MessageRequestSocket;
import com.example.social_be.model.response.CommentResponseSocket;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.CommentRepository;
import com.example.social_be.repository.MessageRepository;
import com.example.social_be.repository.PostRepository;

import org.attoparser.dom.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("https://penguin-brown-eight.vercel.app/")
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
    PostCollection storedPost = postRepository.findPostCollectionById(id);
    if (storedPost == null) {
      Map<String, String> responseError = new HashMap<>();
      responseError.put("error", "This post removed by owner");

      return ResponseEntity.badRequest().body(responseError);
    }

    if (commentRequest.getAction().equals("DELETE")) {
      CommentCollection commentDeleted = commentRepository.deleteCommentCollectionById(commentRequest.getId());
      Map<String, String> responseCommentDel = new HashMap<String, String>();
      responseCommentDel.put("id", commentDeleted.getId());
      responseCommentDel.put("action", "DELETE");
      storedPost.setComments(storedPost.getComments() - 1);

      postRepository.save(storedPost);

      responseCommentDel.put("amountComment", String.valueOf(storedPost.getComments()));

      return ResponseEntity.ok(responseCommentDel);
    }

    storedPost.setComments(storedPost.getComments() + 1);

    CommentCollection commentCollection = new CommentCollection();
    commentCollection.setPostId(commentRequest.getPostId());
    commentCollection.setAvatar(commentRequest.getAvatar());
    commentCollection.setDisplayName(commentRequest.getDisplayName());
    commentCollection.setUserId(commentRequest.getUserId());
    commentCollection.setReplyTo(commentRequest.getReplyTo());
    commentCollection.setContent(commentRequest.getContent());
    commentCollection.setLevel(commentRequest.getLevel());

    postRepository.save(storedPost);

    CommentCollection savedComment = commentRepository.save(commentCollection);

    CommentResponseSocket commentResponseSocket = new CommentResponseSocket();
    commentResponseSocket.setComment(savedComment);
    commentResponseSocket.setAmountComment(storedPost.getComments());

    // if (commentRequest.getLevel().equals("child")) {
    // CommentCollection root =
    // commentRepository.findCommentCollectionById(commentRequest.getRoot());
    // ArrayList<String> subCommentIds = root.getSubCommentIds();
    // subCommentIds.add(savedComment.getId());
    // root.setSubCommentIds(subCommentIds);
    // commentRepository.save(root);
    // }

    return ResponseEntity.ok(commentResponseSocket);
  }

}
