package com.example.social_be.repository;

import com.example.social_be.model.collection.ConversationCollection;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConversationRepository extends MongoRepository<ConversationCollection, String> {
  ConversationCollection findConversationCollectionById(String id);
}
