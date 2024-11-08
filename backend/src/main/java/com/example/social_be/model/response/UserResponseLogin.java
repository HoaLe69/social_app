package com.example.social_be.model.response;

import com.example.social_be.model.collection.UserCollection;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class UserResponseLogin {
  private String id;
  private String userName;
  private String email;
  private String displayName;
  private String avatar;
  private String about;
  private boolean isOnline;
  private List<String> follower;
  private List<String> following;
  private String createAt;
  private String accessToken;

  public UserResponseLogin(UserCollection user, String accessToken) {
    this.id = user.getId();
    this.userName = user.getUserName();
    this.email = user.getEmail();
    this.displayName = user.getDisplayName();
    this.avatar = user.getAvatar();
    this.about = user.getAbout();
    this.isOnline = user.isOnline();
    this.follower = user.getFollower();
    this.following = user.getFollowing();
    this.createAt = user.getCreateAt();
    this.accessToken = accessToken;
  }
}
