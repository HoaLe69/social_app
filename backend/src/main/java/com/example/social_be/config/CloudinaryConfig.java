package com.example.social_be.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
  @Value("${social_app.cloudName}")
  private String CLOUD_NAME;
  @Value("${social_app.cloudApiKey}")
  private String API_KEY;
  @Value("${social_app.cloudSecretKey}")
  private String SECRET_KEY;

  @Bean
  public Cloudinary cloudinary() {
    Map<String, String> config = new HashMap<>();
    config.put("cloud_name", CLOUD_NAME);
    config.put("api_key", API_KEY);
    config.put("api_secret", SECRET_KEY);
    return new Cloudinary(config);
  }
}
