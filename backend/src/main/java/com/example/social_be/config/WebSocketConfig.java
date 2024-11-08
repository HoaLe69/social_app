package com.example.social_be.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    // Registers the endpoint where the connection will take place
    registry.addEndpoint("/ws")
        // Allow the origin http://localhost:63343 to send messages to us. (Base URL of
        // the client)
        .setAllowedOrigins("http://localhost:3000/")
        // Enable SockJS fallback options
        .withSockJS();
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    // Set prefix for the endpoint that the client listens for our messages from
    config.enableSimpleBroker("/topic/", "/queue/");
    // Set prefix for endpoints the client will send messages to
    config.setApplicationDestinationPrefixes("/app");
  }

}
