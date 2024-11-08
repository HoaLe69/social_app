package com.example.social_be.controller;

import com.example.social_be.model.collection.MessageCollection;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000/")
@RequestMapping("/api/message")
public class MessageController {
  @Autowired
  private MessageRepository messageRepository;

  @GetMapping("/all/{id}")
  public ResponseEntity<?> getAllMess(@PathVariable String id) {
    return ResponseEntity.ok(messageRepository.findAllByConversationId(id));
  }

  @PatchMapping("/recall/{id}")
  public ResponseEntity<?> recallMessage(@PathVariable String id) {
    MessageCollection mess = messageRepository.findMessageCollectionById(id);
    if (mess != null) {
      mess.setContent(null);
      messageRepository.save(mess);
      return ResponseEntity.ok("ok");
    }
    return ResponseEntity.badRequest().body("message not found");
  }
}
