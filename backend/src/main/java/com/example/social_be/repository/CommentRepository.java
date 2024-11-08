package com.example.social_be.repository;

import com.example.social_be.model.collection.CommentCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<CommentCollection, String> {
  Page<CommentCollection> findAllByPostId(String id, Pageable pageable);

  CommentCollection findCommentCollectionById(String id);

  List<CommentCollection> findAllByUserId(String id);

  void deleteCommentCollectionById(String id);

  void deleteAllByPostId(String id);
}
