package com.example.social_be.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.social_be.interfaces.FileUpload;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements FileUpload {
  @Autowired
  private Cloudinary cloudinary;

  @Override
  public Map uploadFile(MultipartFile multipartFile) throws IOException {
    return cloudinary.uploader().upload(multipartFile.getBytes(), Map.of("public_id", UUID.randomUUID().toString()));
  }

  public String destroy(String publicId) throws IOException {
    return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap()).toString();
  }
}
