package com.example.social_be.service;

import com.example.social_be.model.collection.UserCollection;
import com.example.social_be.model.custom.CustomUserDetail;
import com.example.social_be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserCollection userCollection = userRepository.findUserCollectionByUserName(username);
    if (userCollection == null)
      throw new UsernameNotFoundException(username);
    return new CustomUserDetail(
        userCollection.getId(),
        userCollection.getUserName(),
        userCollection.getEmail(),
        userCollection.getDisplayName(),
        userCollection.getAvatar(),
        userCollection.getAbout(),
        userCollection.getFollower(),
        userCollection.getFollowing(), new ArrayList<>(),
        userCollection.getPassword());
  }
}
