package com.example.social_be.repository;

import com.example.social_be.model.collection.MessageCollection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<MessageCollection, String> {
  List<MessageCollection> findAllByConversationId(String id);

  MessageCollection findMessageCollectionById(String id);
}
