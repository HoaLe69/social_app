package com.example.social_be.repository;

import com.example.social_be.model.collection.CommentCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<CommentCollection, String> {
  Page<CommentCollection> findAllByPostId(String id, Pageable pageable);
  // List<CommentCollection> findAllByPostId(String id);

  CommentCollection findCommentCollectionById(String id);

  List<CommentCollection> findAllByUserId(String id);

  CommentCollection deleteCommentCollectionById(String id);

  void deleteAllByPostId(String id);
}
