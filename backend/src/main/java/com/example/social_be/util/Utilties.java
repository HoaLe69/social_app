package com.example.social_be.util;

import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Date;

@Data
public class Utilties {
  public String dayTimeFormat() {
    Date date = new Date();
    SimpleDateFormat sdf1 = new SimpleDateFormat("MM-dd-yyyy kk:mm:ss");
    String strDate = sdf1.format(date);
    strDate = sdf1.format(date);
    return strDate;
  }

  public static String extractUsername(String email) {
    if (email == null || !email.contains("@")) {
      throw new IllegalArgumentException("Invalid email address");
    }
    return email.substring(0, email.indexOf("@"));
  }

}
