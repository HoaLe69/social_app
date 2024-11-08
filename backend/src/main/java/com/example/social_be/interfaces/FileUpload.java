package com.example.social_be.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface FileUpload {
  Map uploadFile(MultipartFile multipartFile) throws IOException;
}
