package com.example.social_be.controller;

import com.example.social_be.model.collection.UserCollection;
import com.example.social_be.model.request.AuthLoginGoogleRequest;
import com.example.social_be.model.request.AuthLoginRequest;
import com.example.social_be.model.request.AuthSignUpRequest;
import com.example.social_be.model.response.JwtResponse;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.repository.UserRepository;
import com.example.social_be.service.SendEmailService;
import com.example.social_be.util.AuthUtil;
import com.example.social_be.util.JwtTokenUtil;
import com.example.social_be.util.Utilties;
import jakarta.servlet.http.Cookie;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@CrossOrigin(origins = "https://penguin-brown-eight.vercel.app/", allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private JwtTokenUtil jwtTokenUtil;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private PasswordEncoder encoder;
  @Autowired
  private AuthenticationManager authenticationManager;

  private AuthUtil authUtil;

  public AuthController() {
    authUtil = new AuthUtil();
  }

  @PostMapping("/login")
  @Transactional
  @Async
  public ResponseEntity<?> login(@RequestBody AuthLoginRequest authLoginRequest, HttpServletResponse response) {
    try {

      UserCollection userCheck = userRepository.findUserCollectionByUserName(authLoginRequest.getUserName());
      if (userCheck == null)
        return ResponseEntity.badRequest().body(new MessageResponse("Username không tồn tại!!!"));
      Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
          authLoginRequest.getUserName(), authLoginRequest.getPassword()));
      SecurityContextHolder.getContext().setAuthentication(authentication);
      String accessToken = jwtTokenUtil.generateJwtAccessToken(authLoginRequest.getUserName());
      String refreshToken = jwtTokenUtil.generateJwtRefreshToken(authLoginRequest.getUserName());

      Cookie accessTokenCookie = new Cookie("token", accessToken);
      accessTokenCookie.setHttpOnly(true);
      accessTokenCookie.setMaxAge(60 * 60 * 24);
      accessTokenCookie.setPath("/");

      Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
      refreshTokenCookie.setHttpOnly(true);
      refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);
      refreshTokenCookie.setPath("/");
      // add cookies to the response
      response.addCookie(accessTokenCookie);
      response.addCookie(refreshTokenCookie);

      return ResponseEntity.ok("Login Successfully!");
    } catch (Error ex) {
      throw ex;
    }
  }

  @PostMapping("/loginWithSocial")
  public ResponseEntity<?> loginWithSocial(@RequestBody AuthLoginGoogleRequest userInfo, HttpServletResponse response) {
    UserCollection storedUser = userRepository.findUserCollectionBySocialId(userInfo.getId());
    String username = Utilties.extractUsername(userInfo.getEmail());

    if (storedUser == null) {
      UserCollection userCollection = new UserCollection();
      userCollection.setSocialId(userInfo.getId());
      userCollection.setAvatar(userInfo.getPicture());
      userCollection.setUserName(username);
      userCollection.setDisplayName(userInfo.getGiven_name());
      userCollection.setEmail(userInfo.getEmail());
      userRepository.save(userCollection);
    }
    String accessToken = jwtTokenUtil.generateJwtAccessToken(username);
    String refreshToken = jwtTokenUtil.generateJwtRefreshToken(username);

    authUtil.attachTokenInCookieResponse(response, accessToken, refreshToken);

    return ResponseEntity.ok("ok");
  }

  @GetMapping("/log-out/{name}")
  public ResponseEntity<?> logOut(@PathVariable String name, HttpServletResponse response) {
    Cookie clearAccesstokenCookie = new Cookie("token", null);
    clearAccesstokenCookie.setPath("/");
    clearAccesstokenCookie.setMaxAge(0);

    Cookie clearRefreshtokenCookie = new Cookie("refreshToken", null);
    clearRefreshtokenCookie.setPath("/");
    clearRefreshtokenCookie.setMaxAge(0);

    // add cookies to the response
    response.addCookie(clearAccesstokenCookie);
    response.addCookie(clearRefreshtokenCookie);

    return ResponseEntity.ok("ok");
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody AuthSignUpRequest authSignUpRequest) {
    UserCollection user = userRepository.findUserCollectionByUserName(authSignUpRequest.getUserName());
    if (user == null) {
      String pass = encoder.encode(authSignUpRequest.getPassword());
      authSignUpRequest.setPassword(pass);
      UserCollection userCollection = new UserCollection(authSignUpRequest);
      userRepository.save(userCollection);
      return ResponseEntity.ok(new MessageResponse("Register successfully"));
    }
    return ResponseEntity.badRequest().body(new MessageResponse("Username is exiting"));
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String token, HttpServletResponse response) {
    // return ResponseEntity.badRequest().body(new MessageResponse(token));
    if (StringUtils.hasText(token)) {
      String userName = jwtTokenUtil.getUserNameFromRefreshToken(token);
      UserCollection userCollection = userRepository.findUserCollectionByUserName(userName);
      if (userCollection != null && jwtTokenUtil.validateJwtRefreshToken(token, userName)) {
        String accessToken = jwtTokenUtil.generateJwtAccessToken(userName);
        String refreshToken = jwtTokenUtil.generateJwtRefreshToken(userName);
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        response.addCookie(cookie);
        return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken));
      }
      return ResponseEntity.badRequest().body(new MessageResponse("You are not authenticated"));
    }
    return ResponseEntity.badRequest().body(new MessageResponse("You are not Authenticated"));
  }

}
