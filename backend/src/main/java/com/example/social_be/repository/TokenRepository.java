package com.example.social_be.repository;

import com.example.social_be.model.collection.Token;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TokenRepository extends MongoRepository<Token, String> {
  Token findTokenByUserName(String userName);

  void deleteTokenByUserName(String name);
}
