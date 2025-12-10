package com.Task.employeeAPI.services.abstraction;

import com.Task.employeeAPI.dto.AuthResponseDTO;
import com.Task.employeeAPI.dto.EmployeeDTO;
import com.Task.employeeAPI.dto.EmployeeLoginDTO;
import com.Task.employeeAPI.dto.EmployeeUpdateDTO;

import java.util.List;


public interface IEmployeeService {
    AuthResponseDTO signup(EmployeeDTO employeeDTO);
    AuthResponseDTO login(EmployeeLoginDTO employeeLoginDTO);
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO findEmployeeById(Integer id);
    List<EmployeeDTO> findAll();
    EmployeeDTO deleteEmployeeById(Integer id);
    EmployeeDTO updateEmployeeById(Integer id, EmployeeUpdateDTO employeeDTO);
}
