package com.example.social_be.controller;

import com.example.social_be.model.collection.PostCollection;
import com.example.social_be.model.request.RequestList;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.CommentRepository;
import com.example.social_be.repository.PostRepository;
import com.example.social_be.service.CloudinaryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping(value = "/api/post")
public class PostController {
  @Autowired
  private CloudinaryServiceImpl cloudinary;
  @Autowired
  private PostRepository postRepository;
  @Autowired
  private CommentRepository commentRepository;

  // create post
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional
  public ResponseEntity<?> upload(@RequestPart(value = "thumbnail", required = false) MultipartFile multipartFile,
      @RequestPart("formData") PostCollection postRequest) throws IOException {
    if (multipartFile == null) {
      PostCollection _post = new PostCollection();
      _post.setUserId(postRequest.getUserId());
      _post.setDisplayName(postRequest.getDisplayName());
      _post.setPhotoUrl(postRequest.getPhotoUrl());
      _post.setLike(new ArrayList<>());
      _post.setDescription(postRequest.getDescription());
      _post.setComments(0);
      return ResponseEntity.ok(postRepository.save(_post));
    } else {
      Map<String, String> thumbnail = cloudinary.uploadFile(multipartFile);
      PostCollection _post = new PostCollection(postRequest.getUserId(), postRequest.getPhotoUrl(),
          postRequest.getDisplayName(), postRequest.getTag(), thumbnail.get("url"), thumbnail.get("public_id"),
          postRequest.getDescription());
      return ResponseEntity.ok(postRepository.save(_post));
    }
  }

  @PatchMapping(value = "/edit/{id}/{cloudId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional
  @Async
  public ResponseEntity<?> edit(@RequestPart(value = "thumbnail", required = false) MultipartFile multipartFile,
      @RequestPart("formData") PostCollection postCollection, @PathVariable String id, @PathVariable String cloudId)
      throws IOException {
    PostCollection _post = postRepository.findPostCollectionById(id);
    if (_post == null)
      return ResponseEntity.badRequest().body(new MessageResponse("post is not exiting"));
    if (multipartFile != null) {
      cloudinary.destroy(cloudId);
      Map<String, String> thumbnail = cloudinary.uploadFile(multipartFile);
      _post.setThumbnail(thumbnail.get("url"));
      _post.setCloudinaryId(thumbnail.get("public_id"));
    }
    _post.setDescription(postCollection.getDescription());
    _post.setTag(postCollection.getTag());
    return ResponseEntity.ok(postRepository.save(_post));
  }

  @PostMapping("/all-post-user-following")
  public ResponseEntity<?> getUserFollowing(@RequestBody RequestList list) {
    if (list.getList() != null) {
      List<PostCollection> listPost = new ArrayList<>();
      for (int i = 0; i < list.getList().size(); i++) {
        List<PostCollection> postsFromUser = (postRepository.findAllByUserId((String) list.getList().get(i)));
        listPost.addAll(postsFromUser);
      }
      return ResponseEntity.ok(listPost);
    }
    return ResponseEntity.badRequest().body("list is empty");
  }

  // get all post
  @GetMapping("/all-post")
  public ResponseEntity<?> getAllPost(@RequestParam("page") String page) {
    Pageable pageable = PageRequest.of(Integer.parseInt(page), 2, Sort.by("createAt").descending());
    return ResponseEntity.ok(postRepository.findAll(pageable));
  }

  // get all post of user
  @GetMapping("/all-post-user/{id}")
  public ResponseEntity<?> getAllPostUser(@PathVariable String id) {
    return ResponseEntity.ok(postRepository.findAllByUserId(id));
  }

  @GetMapping("/{id}")
  @Transactional
  public ResponseEntity<?> getPostById(@PathVariable String id) {
    return ResponseEntity.ok(postRepository.findPostCollectionById(id));
  }

  // delete post
  @DeleteMapping("/delete/{id}/{cloudId}")
  @Transactional
  public ResponseEntity<?> deletePost(@PathVariable String id, @PathVariable String cloudId) throws IOException {
    cloudinary.destroy(cloudId);
    commentRepository.deleteAllByPostId(id);
    postRepository.deleteById(id);
    return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
  }

  @PatchMapping("/react/{id}/{userId}")
  @Transactional
  public ResponseEntity<?> reactPost(@PathVariable String id, @PathVariable String userId) {
    PostCollection post = postRepository.findPostCollectionById(id);
    if (post != null) {
      List<String> likes = post.getLike();
      if (likes.contains(userId)) {
        likes.remove(userId);
      } else
        likes.add(userId);
      post.setLike(likes);
      postRepository.save(post);
      return ResponseEntity.ok("ok");
    }
    return ResponseEntity.badRequest().body("This post removed by owner");
  }

}
