package com.example.social_be.model.request;

import lombok.Data;

@Data
public class AuthSignUpRequest {
  private String userName;
  private String email;
  private String password;
}
