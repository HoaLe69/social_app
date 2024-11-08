package com.example.social_be.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
