package com.example.social_be.controller;

import com.example.social_be.model.collection.ConversationCollection;
import com.example.social_be.model.request.ConversationRequest;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/conversation")
@CrossOrigin("https://penguin-brown-eight.vercel.app/")
public class ConversationController {
  @Autowired
  private ConversationRepository conversationRepository;
  @Autowired
  private MongoTemplate mongoTemplate;

  @PostMapping("/create")
  public ResponseEntity<?> createConversation(@RequestBody ConversationRequest conversationRequest) {
    try {
      ConversationCollection conversationCollection = new ConversationCollection(conversationRequest.getMember());
      ConversationCollection savedConversation = conversationRepository.save(conversationCollection);
      return ResponseEntity.ok(savedConversation);
    } catch (Exception ex) {
      return ResponseEntity.badRequest().body(new MessageResponse("Something wrong"));
    }
  }

  @GetMapping("/find/{senderId}/{receiveId}")
  public ResponseEntity<?> findConversation(@PathVariable String senderId, @PathVariable String receiveId) {
    Query query = new Query();
    query.addCriteria(Criteria.where("member").all(senderId, receiveId));
    ConversationCollection result = mongoTemplate.findOne(query, ConversationCollection.class, "room");
    return ResponseEntity.ok(result);
  }

  @GetMapping("/all/{id}")
  public ResponseEntity<?> getAllRoomConversation(@PathVariable String id) {
    List<ConversationCollection> rooms = conversationRepository.findAll();
    List<ConversationCollection> roomRes = new ArrayList<>();
    for (ConversationCollection room : rooms) {
      String idMemberFirst = room.getMember().get(0);
      String idMemberSecond = room.getMember().get(1);
      if (idMemberFirst.equals(id) || idMemberSecond.equals(id))
        roomRes.add(room);
    }
    return ResponseEntity.ok(roomRes);
  }

  @PatchMapping("/update/lastestMessage/{id}")
  public ResponseEntity<?> updateLastestMessage(@PathVariable String id,
      @RequestBody ConversationCollection conversation) {
    ConversationCollection conversationCollection = conversationRepository.findConversationCollectionById(id);
    conversationCollection.setLastestMessage(conversation.getLastestMessage());
    conversationRepository.save(conversationCollection);
    return ResponseEntity.ok(new MessageResponse("ok"));
  }
}
