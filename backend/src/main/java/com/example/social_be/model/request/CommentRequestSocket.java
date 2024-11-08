package com.example.social_be.model.request;

import com.example.social_be.model.collection.CommentCollection;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class CommentRequestSocket {
  private String id;
  private String postId;
  private String avatar;
  private String displayName;
  private String userId;
  private String replyId;
  private String content;
  private List<CommentCollection> reply;
  private int deleteComment;
  private String subCommentId;
  private String createAt;
}
