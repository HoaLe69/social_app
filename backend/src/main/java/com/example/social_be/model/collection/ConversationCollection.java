package com.example.social_be.model.collection;

import com.example.social_be.util.Utilties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document("room")
@AllArgsConstructor
@NoArgsConstructor
public class ConversationCollection {
  private String id;
  private List<String> member;
  private String lastestMessage;
  private String createAt;

  public ConversationCollection(List<String> member) {
    this.lastestMessage = "Bây giờ các bạn có thể nhắn tin cho nhau";
    this.member = member;
    this.createAt = new Utilties().dayTimeFormat();
  }
}
