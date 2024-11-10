package com.example.social_be.model.request;

import lombok.Data;

@Data
public class AuthLoginGoogleRequest {
  private String email;
  private String given_name;
  private String id;
  private String name;
  private String picture;
  private boolean verified_email;
}
