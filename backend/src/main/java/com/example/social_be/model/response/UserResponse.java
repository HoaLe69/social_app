package com.example.social_be.model.response;

import com.example.social_be.model.collection.UserCollection;
import lombok.Data;

import java.util.List;

@Data
public class UserResponse {
  private String id;
  private String userName;
  private String email;
  private String displayName;
  private String avatar;
  private String about;
  private List<String> follower;
  private List<String> following;

  public UserResponse(UserCollection user) {
    this.id = user.getId();
    this.userName = user.getUserName();
    this.email = user.getEmail();
    this.displayName = user.getDisplayName();
    this.avatar = user.getAvatar();
    this.about = user.getAbout();
    this.follower = user.getFollower();
    this.following = user.getFollowing();
  }

  public UserResponse(String _id, String userName, String email, String displayName, String avatar, String about,
      List<String> follower, List<String> following) {
    this.id = _id;
    this.userName = userName;
    this.email = email;
    this.displayName = displayName;
    this.avatar = avatar;
    this.about = about;
    this.follower = follower;
    this.following = following;
  }

}
