package com.Task.employeeAPI.dto;

import lombok.Data;

@Data
public class UserInfoDTO {

    private Integer id;
    private String fullName;
    private String email;
    private String role;
}
