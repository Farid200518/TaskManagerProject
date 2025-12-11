package com.Task.employeeAPI.services.concrete;

import com.Task.employeeAPI.dao.Entity.Task;
import com.Task.employeeAPI.dao.Entity.TaskWorkflow;
import com.Task.employeeAPI.dao.Repository.TaskRepository;
import com.Task.employeeAPI.dao.Repository.TaskWorkflowRepository;
import com.Task.employeeAPI.dto.AuthResponseDTO;
import com.Task.employeeAPI.dto.EmployeeUpdateDTO;
import com.Task.employeeAPI.exceptions.BadRequestException;
import com.Task.employeeAPI.exceptions.NotFoundException;
import com.Task.employeeAPI.security.JwtTokenUtil;
import com.Task.employeeAPI.dao.Entity.Employee;
import com.Task.employeeAPI.dao.Repository.EmployeeRepository;
import com.Task.employeeAPI.dto.EmployeeDTO;
import com.Task.employeeAPI.dto.EmployeeLoginDTO;
import com.Task.employeeAPI.mapper.EmployeeMapper;
import com.Task.employeeAPI.services.abstraction.IEmployeeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService implements IEmployeeService {

    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;
    private final TaskWorkflowRepository taskWorkflowRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;
    private final EmployeeMapper employeeMapper;

    @Override
    public AuthResponseDTO signup(EmployeeDTO employeeDTO) {

        Employee existingByEmail = employeeRepository.findByEmailAndIsDeletedFalse(employeeDTO.getEmail());
        if (existingByEmail != null) {
            throw new BadRequestException("Email already exists");
        }

        Employee employee = Employee.builder()
                .name(employeeDTO.getName())
                .surname(employeeDTO.getSurname())
                .email(employeeDTO.getEmail())
                .password(passwordEncoder.encode(employeeDTO.getPassword()))
                .role(employeeDTO.getRole())
                .build();

        employeeRepository.save(employee);

        // Generate JWT using their email (or ID if you want)
        String token = jwtTokenUtil.generateToken(employee.getEmail());

        // Create response object
        AuthResponseDTO.UserInfo userInfo = new AuthResponseDTO.UserInfo(
                employee.getId(),
                employee.getName() + " " + employee.getSurname(),
                employee.getEmail(),
                employee.getRole().name()
        );

        return new AuthResponseDTO(token, userInfo);
    }


    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO login(EmployeeLoginDTO employeeLoginDTO) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            employeeLoginDTO.getEmail(),
                            employeeLoginDTO.getPassword()
                    )
            );

            Employee employee = employeeRepository.findByEmailAndIsDeletedFalse(employeeLoginDTO.getEmail());
            if (employee == null) {
                throw new com.Task.employeeAPI.exceptions.BadCredentialsException("Invalid email or password");
            }

            String token = jwtTokenUtil.generateToken(employee.getEmail());

            AuthResponseDTO.UserInfo userInfo = new AuthResponseDTO.UserInfo(
                    employee.getId(),
                    employee.getName() + " " + employee.getSurname(),
                    employee.getEmail(),
                    employee.getRole().name()
            );

            return new AuthResponseDTO(token, userInfo);

        } catch (AuthenticationException ex) {
            throw new com.Task.employeeAPI.exceptions.BadCredentialsException("Invalid email or password");
        }
    }


    @Override
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        if (employeeDTO == null) {
            throw new BadRequestException("Employee input must not be null");
        }

        Employee existingByEmail = employeeRepository.findByEmailAndIsDeletedFalse(employeeDTO.getEmail());

        if (existingByEmail != null) {
            throw new BadRequestException("Email or username already exists");
        }

        Employee employee = modelMapper.map(employeeDTO, Employee.class);
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employeeRepository.save(employee);
        return modelMapper.map(employee, EmployeeDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDTO findEmployeeById(Integer id) {
        Employee employee = employeeMapper.findEmployeeById(id);

        if (employee == null) {
            throw new NotFoundException("Employee with ID " + id + " was not found!");
        }

        return modelMapper.map(employee, EmployeeDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> findAll() {
        return employeeRepository
                .findByIsDeletedFalse()
                .stream()
                .map(employee -> modelMapper.map(employee, EmployeeDTO.class))
                .toList();
    }

    @Override
    public EmployeeDTO deleteEmployeeById(Integer id) {
        Employee employee = employeeRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Employee with  ID " + id + " doesn't exist!"));

        employee.setDeleted(true);
        List<Task> tasks = taskRepository.findByEmployee_id(employee.getId());
        for (Task task : tasks) {
            List<TaskWorkflow> workflows = taskWorkflowRepository.findByTask_Id(task.getId());
            taskWorkflowRepository.deleteAll(workflows);
            taskRepository.deleteById(task.getId());
        }
        employeeRepository.save(employee);
        return modelMapper.map(employee, EmployeeDTO.class);
    }

    @Override
    public EmployeeDTO updateEmployeeById(Integer id, EmployeeUpdateDTO employeeDTO) {
        if (employeeDTO == null) {
            throw new BadRequestException("Employee input must not be null");
        }


        Employee employee = employeeRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Employee with  ID " + id + " doesn't exist!"));


        employee.setName(employeeDTO.getName());
        employee.setSurname(employeeDTO.getSurname());
        employeeRepository.save(employee);
        return modelMapper.map(employee, EmployeeDTO.class);
    }
}
