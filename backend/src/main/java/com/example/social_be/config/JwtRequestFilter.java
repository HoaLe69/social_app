package com.example.social_be.config;

import com.example.social_be.repository.TokenRepository;
import com.example.social_be.repository.UserRepository;
import com.example.social_be.service.UserService;
import com.example.social_be.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  @Autowired
  private JwtTokenUtil jwtTokenUtil;
  @Autowired
  private TokenRepository tokenRepository;

  @Autowired
  private UserService userService;

  private String getTokenFromRequest(HttpServletRequest request) {
    String token = request.getHeader("Authorization");
    if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
      return token.substring(7);
    }
    return null;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      if (request.getServletPath().contains("/api/auth")) {
        filterChain.doFilter(request, response);
        return;
      }
      String token = getTokenFromRequest(request);
      if (StringUtils.hasText(token)) {
        String userName = jwtTokenUtil.getUserNameFromAccessToken(token);
        UserDetails userDetails = userService.loadUserByUsername(userName);
        String tokenFromDB = tokenRepository.findTokenByUserName(userName).getAcessToken();
        if (token.equals(tokenFromDB) && userDetails != null
            && jwtTokenUtil.validateJwtAccessToken(token, userDetails.getUsername())) {
          UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails,
              null, new ArrayList<>());
          authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
      }
    } catch (Exception ex) {
      throw new RuntimeException("fails on set user authentication", ex);
    }
    filterChain.doFilter(request, response);
  }
}
