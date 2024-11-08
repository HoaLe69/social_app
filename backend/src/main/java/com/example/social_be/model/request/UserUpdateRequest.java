package com.example.social_be.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {
  private String password;
  private String displayName;
  private String avatar;
  private String about;
}
