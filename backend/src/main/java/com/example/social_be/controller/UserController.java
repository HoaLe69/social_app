package com.example.social_be.controller;

import com.example.social_be.model.collection.CommentCollection;
import com.example.social_be.model.collection.PostCollection;
import com.example.social_be.model.collection.UserCollection;
import com.example.social_be.model.custom.CustomUserDetail;
import com.example.social_be.model.request.RequestList;
import com.example.social_be.model.request.UserUpdateRequest;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.model.response.UserResponse;
import com.example.social_be.repository.CommentRepository;
import com.example.social_be.repository.PostRepository;
import com.example.social_be.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
@RequestMapping(value = "/api/user")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);
  @Autowired
  private UserRepository userRepository;
  // get user by id
  @Autowired
  private PasswordEncoder encoder;

  @Autowired
  private PostRepository postRepository;

  @Autowired
  private CommentRepository commentRepository;

  @GetMapping("/search")
  public ResponseEntity<?> searchUser(@RequestParam String name) {
    return ResponseEntity.ok(userRepository.findByLikeUserName(name).stream().limit(3));
  }

  @GetMapping("/verify")
  public ResponseEntity<?> verifyUser() {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      if (authentication != null) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();

        return ResponseEntity.ok(new UserResponse(userDetail.get_id(), userDetail.getUsername(), userDetail.getEmail(),
            userDetail.getDisplayName(), userDetail.getAvatar(), userDetail.getAvatar(), userDetail.getFollower(),
            userDetail.getFollowing()));
      }
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
    } catch (Exception ex) {
      throw ex;
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getUserById(@PathVariable String id) {
    try {
      UserCollection userCollection = userRepository.findUserCollectionById(id);
      return ResponseEntity.ok(new UserResponse(userCollection));
    } catch (Exception ex) {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/getUserFollow")
  public ResponseEntity<?> getUserFollowing(@RequestBody RequestList following) {
    if (following.getList() != null) {
      List<UserResponse> userFollowing = new ArrayList<>();
      for (int i = 0; i < following.getList().size(); i++) {
        userFollowing.add(new UserResponse(userRepository.findUserCollectionById((String) following.getList().get(i))));
      }
      return ResponseEntity.ok(userFollowing);
    }
    return ResponseEntity.badRequest().body(following);
  }

  // update user by id
  @PatchMapping("/update/{id}")
  @Transactional
  @Async
  public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest update, @PathVariable String id) {
    try {
      UserCollection user = userRepository.findUserCollectionById(id);
      List<PostCollection> posts = postRepository.findAllByUserId(id);
      List<CommentCollection> comments = commentRepository.findAllByUserId(id);
      if (user != null) {
        if (!posts.isEmpty()) {
          for (PostCollection post : posts) {
            post.setDisplayName(update.getDisplayName() != null ? update.getDisplayName() : user.getDisplayName());
            post.setPhotoUrl(update.getAvatar() != null ? update.getAvatar() : user.getAvatar());
            postRepository.save(post);
          }
        }
        if (!comments.isEmpty()) {
          for (CommentCollection comment : comments) {
            comment.setDisplayName(update.getDisplayName() != null ? update.getDisplayName() : user.getDisplayName());
            comment.setAvatar(update.getAvatar() != null ? update.getAvatar() : user.getAvatar());
            commentRepository.save(comment);
          }
        }
        user.setDisplayName(update.getDisplayName() != null ? update.getDisplayName() : user.getDisplayName());
        user.setAbout(update.getAbout() != null ? update.getAbout() : user.getAbout());
        user.setAvatar(update.getAvatar() != null ? update.getAvatar() : user.getAvatar());
        userRepository.save(user);
        return ResponseEntity.ok(new UserResponse(user));
      } else {
        return ResponseEntity.badRequest().body(new MessageResponse("Something wrong"));
      }
    } catch (Exception ex) {
      return ResponseEntity.badRequest().body(new MessageResponse("Something wrong"));
    }
  }

  // delete user by id
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable String id) {
    userRepository.deleteById(id);
    return ResponseEntity.ok(new MessageResponse("Delete Successfully !!"));
  }

  // follow and unfollow
  @PatchMapping("/interactive/{id}")
  @Transactional
  public ResponseEntity<?> interactiveUser(@RequestBody UserCollection userId, @PathVariable String id) {
    String currentId = userId.getId();
    if (!currentId.equals(id)) {
      UserCollection currentUser = userRepository.findUserCollectionById(currentId);
      UserCollection userFollow = userRepository.findUserCollectionById(id);

      List<String> listFollowing = currentUser.getFollowing();
      List<String> listFollower = userFollow.getFollower();
      try {
        if (!listFollowing.contains(id)) {
          listFollowing.add(id);
          currentUser.setFollowing(listFollowing);
          userRepository.save(currentUser);
          listFollower.add(currentId);
          userFollow.setFollower(listFollower);
          userRepository.save(userFollow);
          return ResponseEntity.ok(new UserResponse(userFollow));
        } else {
          listFollowing.remove(id);
          currentUser.setFollowing(listFollowing);
          userRepository.save(currentUser);
          listFollower.remove(currentId);
          userFollow.setFollower(listFollower);
          userRepository.save(userFollow);
          return ResponseEntity.ok(new UserResponse(userFollow));
        }
      } catch (Exception ex) {
        throw new RuntimeException("fail to perform follow!!", ex);
      }
    } else {
      return ResponseEntity.badRequest().body(new MessageResponse("You can't not follow yourself!!!"));
    }
  }
}
