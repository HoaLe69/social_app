package com.example.social_be;

import com.example.social_be.service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class SocialBeApplication {

  public static void main(String[] args) {
    SpringApplication.run(SocialBeApplication.class, args);
  }

}
