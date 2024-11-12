package com.example.social_be.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;

@AllArgsConstructor
@Data
public class CommentRequestSocket {
  private String id;
  private String postId;
  private String avatar;
  private String displayName;
  private String userId;
  private String replyTo;
  private String content;
  private ArrayList<String> subCommentIds;
  private String level;
  private String root;
  private String action;
}
