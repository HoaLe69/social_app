package com.example.social_be.repository;

import com.example.social_be.model.collection.PostCollection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<PostCollection, String> {
  PostCollection findPostCollectionById(String id);

  List<PostCollection> findAllByUserId(String id);

}
