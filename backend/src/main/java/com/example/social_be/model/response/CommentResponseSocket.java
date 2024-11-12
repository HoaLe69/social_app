package com.example.social_be.model.response;

import com.example.social_be.model.collection.CommentCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseSocket {
  private CommentCollection comment;
  private Long amountComment;
}
