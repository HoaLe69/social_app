package com.example.social_be.model.collection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document("token")
public class Token {
  private String userName;
  private String AcessToken;
  private List<String> RefreshToken;

  public Token(String name, String accessToken, String refreshToken) {
    this.userName = name;
    this.AcessToken = accessToken;
    List<String> refresh = new ArrayList<>();
    refresh.add(refreshToken);
    this.RefreshToken = refresh;
  }
}
