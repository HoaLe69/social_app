package com.example.social_be.repository;

import com.example.social_be.model.collection.UserCollection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserRepository extends MongoRepository<UserCollection, String> {
  UserCollection findUserCollectionByUserName(String userName);

  UserCollection findUserCollectionById(String Id);

  UserCollection findUserCollectionBySocialId(String Id);

  @Query("{ displayName : { $regex : ?0 } }")
  List<UserCollection> findByLikeUserName(String name);

  @Query("{ email : { $regex : ?0 } }")
  List<UserCollection> findByLikeEmail(String email);
}
