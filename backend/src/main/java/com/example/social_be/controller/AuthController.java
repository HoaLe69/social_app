package com.example.social_be.controller;

import com.example.social_be.model.collection.Token;
import com.example.social_be.model.collection.UserCollection;
import com.example.social_be.model.request.AuthLoginRequest;
import com.example.social_be.model.request.AuthSignUpRequest;
import com.example.social_be.model.response.JwtResponse;
import com.example.social_be.model.response.MessageResponse;
import com.example.social_be.model.response.UserResponse;
import com.example.social_be.model.response.UserResponseLogin;
import com.example.social_be.repository.TokenRepository;
import com.example.social_be.repository.UserRepository;
import com.example.social_be.service.SendEmailService;
import com.example.social_be.util.JwtTokenUtil;
import jakarta.servlet.http.Cookie;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;

import java.io.IOException;

@RestController
@CrossOrigin("http://localhost:3000/")
@RequestMapping(value = "/api/auth")
public class AuthController {
  @Autowired
  private JwtTokenUtil jwtTokenUtil;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private PasswordEncoder encoder;
  @Autowired
  private AuthenticationManager authenticationManager;
  @Autowired
  private TokenRepository tokenRepository;
  @Autowired
  private SendEmailService emailService;

  @PostMapping("/login")
  @Transactional
  @Async
  public ResponseEntity<?> login(@RequestBody AuthLoginRequest authLoginRequest, HttpServletResponse response) {
    UserCollection userCheck = userRepository.findUserCollectionByUserName(authLoginRequest.getUserName());
    if (userCheck == null)
      return ResponseEntity.badRequest().body(new MessageResponse("Username không tồn tại!!!"));
    if (userCheck.getActiveAccount() == 0)
      return ResponseEntity.badRequest().body(new MessageResponse("Your account is not active!"));
    Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
        authLoginRequest.getUserName(), authLoginRequest.getPassword()));
    if (authentication.isAuthenticated()) {
      String accessToken = jwtTokenUtil.generateJwtAccessToken(authLoginRequest.getUserName());
      String refreshToken = jwtTokenUtil.generateJwtRefreshToken(authLoginRequest.getUserName());
      Token token = tokenRepository.findTokenByUserName(authLoginRequest.getUserName());
      if (token == null) {
        Token _token = new Token(authLoginRequest.getUserName(), accessToken, refreshToken);
        tokenRepository.save(_token);
      } else {
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Tài khoản của bạn đang đăng nhập ở nơi khác! , Vui lòng đăng xuất"));
      }
      UserResponseLogin currentUserLogin = new UserResponseLogin(userCheck, accessToken);
      return ResponseEntity.ok(currentUserLogin);
    }
    return ResponseEntity.badRequest().body(new MessageResponse("fails to authenticated"));
  }

  @GetMapping("/log-out/{name}")
  public ResponseEntity<?> logOut(@PathVariable String name) {
    tokenRepository.deleteTokenByUserName(name);
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
      Context context = new Context();
      context.setVariable("username", authSignUpRequest.getUserName());
      emailService.sendEmailWithHtmlTemplate(authSignUpRequest.getEmail(), "Penguin hup", "verification-email",
          context);
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

  @PostMapping("/send-email/forgot-pass")
  public ResponseEntity<?> sendEmailForgotPass(@RequestBody UserCollection userRequest) {
    UserCollection user = userRepository.findUserCollectionByUserName(userRequest.getUserName());
    if (user == null)
      return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    if (!user.getEmail().equals(userRequest.getEmail()))
      return ResponseEntity.badRequest().body(new MessageResponse("Email is invalid"));
    Context context = new Context();
    context.setVariable("username", userRequest.getUserName());
    emailService.sendEmailWithHtmlTemplate(userRequest.getEmail(), "Penguin hup", "forgot-password", context);
    return ResponseEntity.ok("ok");
  }

  @PatchMapping("/reset-pass/{userName}")
  public ResponseEntity<?> resetPassWord(@PathVariable String userName, @RequestBody UserCollection userRequest) {
    UserCollection user = userRepository.findUserCollectionByUserName(userName);
    if (user == null)
      return ResponseEntity.badRequest().body(new MessageResponse("user not found"));
    String pass = encoder.encode(userRequest.getPassword());
    user.setPassword(pass);
    userRepository.save(user);
    return ResponseEntity.ok(new MessageResponse("Successfully!!!"));
  }

  @GetMapping("/active-account/{username}")
  public ResponseEntity<?> activeAcccount(@PathVariable String username) {
    UserCollection user = userRepository.findUserCollectionByUserName(username);
    if (user != null) {
      user.setActiveAccount(1);
      userRepository.save(user);
      return ResponseEntity.ok(new MessageResponse("Account is active"));
    }
    return ResponseEntity.badRequest().body(new MessageResponse("user not found"));
  }

  @PostMapping("/send/{email}")
  public ResponseEntity<?> sendEmail(@PathVariable("email") String email) throws IOException {
    Context context = new Context();
    context.setVariable("username", "lelelele");
    emailService.sendEmailWithHtmlTemplate(email, "Penguin hup", "verification-email", context);
    return ResponseEntity.ok(new MessageResponse("send successfully"));
  }
}
