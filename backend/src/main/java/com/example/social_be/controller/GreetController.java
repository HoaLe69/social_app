package com.example.social_be.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class GreetController {
  @GetMapping("/")
  public String greet(Model model) {
    model.addAttribute("message", "Welcome to Penguin!!!");
    return "home"; // refres to resource/templates/home.html
  }

}
