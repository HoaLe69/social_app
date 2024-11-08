package com.example.social_be.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ConversationRequest {
  private List<String> member;
  private String lastestMessage;
}
