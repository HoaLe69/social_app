package com.example.social_be.model.custom;

import com.example.social_be.model.collection.UserCollection;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@AllArgsConstructor
public class CustomUserDetail implements UserDetails {
  private String _id;
  private String username;
  private String password;
  private String email;
  private String displayName;
  private String avatar;
  private String about;
  private List<String> follower;
  private List<String> following;
  private Collection<? extends GrantedAuthority> authorities;

  public CustomUserDetail(
      String id, String userName, String email, String displayName,
      String avatar, String about, List<String> follower, List<String> following,
      Collection<? extends GrantedAuthority> authorities, String password) {
    this._id = id;
    this.username = userName;
    this.email = email;
    this.displayName = displayName;
    this.avatar = avatar;
    this.about = about;
    this.follower = follower;
    this.following = following;
    this.authorities = authorities;
    this.password = password;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.authorities;
  }

  @Override
  public String getPassword() {
    return this.password;
  }

  @Override
  public String getUsername() {
    return this.username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
