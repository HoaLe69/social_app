package com.example.social_be.model.collection;

import com.example.social_be.util.Utilties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageCollection {
  private String userId;
  private String content;
  private MessageCollection reply;
  private String id;
  private String conversationId;
  private String createAt;

  public MessageCollection(String content, String userId, String conversationId) {
    this.content = content;
    this.userId = userId;
    this.conversationId = conversationId;
    this.createAt = new Utilties().dayTimeFormat();
  }
}
