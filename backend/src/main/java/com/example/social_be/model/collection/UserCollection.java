package com.example.social_be.model.collection;

import com.example.social_be.model.request.AuthSignUpRequest;
import com.example.social_be.util.Utilties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "users")
@Data
@Builder
@AllArgsConstructor
public class UserCollection {
  private String id;
  private String userName;
  private String password;
  private String email;
  private String displayName;
  private String avatar;
  private String about;
  private boolean isOnline;
  private List<String> follower;
  private List<String> following;
  private String createAt;
  private int activeAccount;

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
    this.activeAccount = 0;
    this.follower = new ArrayList<>();
    this.following = new ArrayList<>();
    this.createAt = new Utilties().dayTimeFormat();
  }
}
