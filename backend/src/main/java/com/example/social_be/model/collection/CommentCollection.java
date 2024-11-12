package com.example.social_be.model.collection;

import com.example.social_be.util.Utilties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("comment")
@Data
@AllArgsConstructor
public class CommentCollection {
  private String id;
  private String postId;
  private String avatar;
  private String displayName;
  private String userId;
  private String replyTo;
  private String content;
  private String level;
  private ArrayList<String> subCommentIds;
  private String createAt;

  public CommentCollection(String userId, String avatar, String postId, String content, String displayName) {
    this.userId = userId;
    this.avatar = avatar;
    this.postId = postId;
    this.content = content;
    this.displayName = displayName;
    this.subCommentIds = new ArrayList<>();
    this.createAt = new Utilties().dayTimeFormat();
  }

  public CommentCollection(String userId, String avatar, String content, String displayName, String replyId,
      String subCommentId) {
    this.id = subCommentId;
    this.userId = userId;
    this.avatar = avatar;
    this.content = content;
    this.displayName = displayName;
    this.replyTo = replyId;
    this.createAt = new Utilties().dayTimeFormat();
  }

  public CommentCollection() {
    this.createAt = new Utilties().dayTimeFormat();
    this.subCommentIds = new ArrayList<>();
  }
}
