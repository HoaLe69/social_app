package com.example.social_be.model.request;

import com.example.social_be.model.collection.MessageCollection;
import com.example.social_be.util.Utilties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequestSocket {
  private String userId;
  private String content;
  private MessageCollection reply;
  private String id;
  private int deleteMessage;
  private String conversationId;
  private String createAt;
}
