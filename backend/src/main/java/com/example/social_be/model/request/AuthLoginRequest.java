package com.example.social_be.model.request;

import lombok.Data;

@Data
public class AuthLoginRequest {
  private String userName;
  private String password;
}
