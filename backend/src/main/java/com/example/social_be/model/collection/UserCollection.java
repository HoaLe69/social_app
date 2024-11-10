package com.example.social_be.model.collection;

import com.example.social_be.model.request.AuthSignUpRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@Builder
@AllArgsConstructor
public class UserCollection {
  private String id;
  private String socialId;
  private String userName;
  private String password;
  private String email;
  private String displayName;
  private String avatar;
  private String about;
  private List<String> follower;
  private List<String> following;

  public UserCollection() {
    this.displayName = null;
    this.avatar = null;
    this.about = null;
    this.follower = new ArrayList<>();
    this.following = new ArrayList<>();
  }

  public UserCollection(AuthSignUpRequest authSignUpRequest) {
    this.userName = authSignUpRequest.getUserName();
    this.email = authSignUpRequest.getEmail();
    this.password = authSignUpRequest.getPassword();
    this.displayName = authSignUpRequest.getUserName();
    this.avatar = null;
    this.about = null;
    this.follower = new ArrayList<>();
    this.following = new ArrayList<>();
  }
}
