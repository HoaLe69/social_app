package com.example.social_be.config;

import com.example.social_be.repository.TokenRepository;
import com.example.social_be.service.UserService;
import com.example.social_be.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  @Autowired
  private JwtTokenUtil jwtTokenUtil;

  @Autowired
  private UserService userService;

  private String getCookies(String cookieName, Cookie[] cookies) {
    for (int i = 0; i < cookies.length; i++) {
      Cookie cookie = cookies[i];
      if (cookieName.equals(cookie.getName())) {
        return cookie.getValue();
      }
    }
    return "";
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      if (request.getServletPath().contains("/api/auth")) {
        filterChain.doFilter(request, response);
        return;
      }
      Cookie[] cookies = request.getCookies();
      String token = getCookies("token", cookies);

      if (StringUtils.hasText(token)) {
        String userName = jwtTokenUtil.getUserNameFromAccessToken(token);
        logger.info("username " + userName);
        UserDetails userDetails = userService.loadUserByUsername(userName);

        if (userDetails != null
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
