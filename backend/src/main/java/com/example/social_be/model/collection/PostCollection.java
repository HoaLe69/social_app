package com.example.social_be.model.collection;

import com.example.social_be.util.Utilties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(value = "posts")
@Data
@AllArgsConstructor
@Builder
@Jacksonized
public class PostCollection {
  private String id;
  private String userId;
  private String cloudinaryId;
  private String photoUrl;
  private String displayName;
  private String tag;
  private String thumbnail;
  private List<String> like;
  private String description;
  private long comments;
  private String createAt;

  public PostCollection(String userId, String photoUrl, String displayName, String tag, String thumbnail,
      String cloudinaryId, String description) {
    this.userId = userId;
    this.photoUrl = photoUrl;
    this.displayName = displayName;
    this.tag = tag;
    this.thumbnail = thumbnail;
    this.cloudinaryId = cloudinaryId;
    this.like = new ArrayList<>();
    this.description = description;
    this.comments = 0;
    this.createAt = new Utilties().dayTimeFormat();
  }

  public PostCollection() {
    this.createAt = new Utilties().dayTimeFormat();
  }
}
