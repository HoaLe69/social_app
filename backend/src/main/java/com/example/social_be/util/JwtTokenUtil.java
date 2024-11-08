package com.example.social_be.util;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenUtil {
  @Value("${social_app.secret}")
  private String jwtSecretKey;
  @Value("${social_app.secretRefresh}")
  private String jwtSecretKeyRefresh;
  @Value("${social_app.expireTime}")
  private long TOKEN_VALIDITY;
  @Value("${sociall_app.expireTimeRefresh}")
  private long TOKEN_VALIDITY_REFRESH;

  public String generateToken(String userName, String secretKey, long expireTime) {
    return Jwts.builder().setSubject(userName).setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expireTime * 1000))
        .signWith(SignatureAlgorithm.HS512, secretKey)
        .compact();
  }

  public String getUserNameFromClamis(String token, String secretKey) {
    final Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    return claims.getSubject();
  }

  public String generateJwtAccessToken(String userName) {
    return this.generateToken(userName, jwtSecretKey, TOKEN_VALIDITY);
  }

  public String generateJwtRefreshToken(String userName) {
    return this.generateToken(userName, jwtSecretKeyRefresh, TOKEN_VALIDITY_REFRESH);
  }

  public boolean validateToken(String userName, String token, String secretKey) {
    String username = this.getUserNameFromClamis(token, secretKey);
    final Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    boolean isTokenExpried = claims.getExpiration().before(new Date());
    return (userName.equals(username) && !isTokenExpried);
  }

  public boolean validateJwtAccessToken(String token, String userName) {
    return this.validateToken(userName, token, jwtSecretKey);
  }

  public boolean validateJwtRefreshToken(String token, String userName) {
    return this.validateToken(userName, token, jwtSecretKeyRefresh);
  }

  public String getUserNameFromAccessToken(String token) {
    return this.getUserNameFromClamis(token, jwtSecretKey);
  }

  public String getUserNameFromRefreshToken(String token) {
    return this.getUserNameFromClamis(token, jwtSecretKeyRefresh);
  }
}
