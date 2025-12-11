package com.Task.employeeAPI.unit;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.Task.employeeAPI.dao.Entity.Employee;
import com.Task.employeeAPI.dao.Entity.Task;
import com.Task.employeeAPI.dao.Entity.TaskWorkflow;
import com.Task.employeeAPI.dao.Enums.Role;
import com.Task.employeeAPI.dao.Repository.EmployeeRepository;
import com.Task.employeeAPI.dao.Repository.TaskRepository;
import com.Task.employeeAPI.dao.Repository.TaskWorkflowRepository;
import com.Task.employeeAPI.dto.AuthResponseDTO;
import com.Task.employeeAPI.dto.EmployeeDTO;
import com.Task.employeeAPI.dto.EmployeeLoginDTO;
import com.Task.employeeAPI.dto.EmployeeUpdateDTO;
import com.Task.employeeAPI.exceptions.BadRequestException;
import com.Task.employeeAPI.exceptions.NotFoundException;
import com.Task.employeeAPI.mapper.EmployeeMapper;
import com.Task.employeeAPI.security.JwtTokenUtil;
import com.Task.employeeAPI.services.concrete.EmployeeService;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @InjectMocks
    private EmployeeService employeeService;

    @Mock private EmployeeRepository employeeRepository;
    @Mock private TaskRepository taskRepository;
    @Mock private TaskWorkflowRepository taskWorkflowRepository;
    @Mock private JwtTokenUtil jwtTokenUtil;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private ModelMapper modelMapper;
    @Mock private EmployeeMapper employeeMapper;

    // -----------------------------------------------------
    // SIGNUP
    // -----------------------------------------------------

    @Test
    void signup_success() {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmail("test@example.com");
        dto.setName("John");
        dto.setSurname("Doe");
        dto.setPassword("1234");
        dto.setRole(Role.EMPLOYEE);

        when(employeeRepository.findByEmailAndIsDeletedFalse("test@example.com"))
                .thenReturn(null);

        when(passwordEncoder.encode("1234"))
                .thenReturn("encoded-pass");

        Employee saved = Employee.builder()
                .id(1)
                .name("John")
                .surname("Doe")
                .email("test@example.com")
                .password("encoded-pass")
                .role(Role.EMPLOYEE)
                .build();

        when(employeeRepository.save(any(Employee.class))).thenReturn(saved);
        when(jwtTokenUtil.generateToken("test@example.com"))
                .thenReturn("jwt-token");

        AuthResponseDTO result = employeeService.signup(dto);

        assertEquals("jwt-token", result.getToken());
        assertEquals("John Doe", result.getUser().getFullName());
        assertEquals("test@example.com", result.getUser().getEmail());
    }

    @Test
    void signup_emailExists_throws() {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmail("test@example.com");

        when(employeeRepository.findByEmailAndIsDeletedFalse("test@example.com"))
                .thenReturn(new Employee());

        assertThrows(BadRequestException.class, () -> employeeService.signup(dto));
    }

    // -----------------------------------------------------
    // LOGIN
    // -----------------------------------------------------

    @Test
    void login_success() {
        EmployeeLoginDTO login = new EmployeeLoginDTO();
        login.setEmail("test@example.com");
        login.setPassword("1234");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);

        Employee employee = new Employee();
        employee.setId(1);
        employee.setName("John");
        employee.setSurname("Doe");
        employee.setEmail("test@example.com");
        employee.setRole(Role.EMPLOYEE);

        when(employeeRepository.findByEmailAndIsDeletedFalse("test@example.com"))
                .thenReturn(employee);

        when(jwtTokenUtil.generateToken("test@example.com"))
                .thenReturn("jwt-token");

        AuthResponseDTO result = employeeService.login(login);

        assertEquals("jwt-token", result.getToken());
        assertEquals("test@example.com", result.getUser().getEmail());
    }

    @Test
    void login_authenticationFails_throws() {
        EmployeeLoginDTO login = new EmployeeLoginDTO();

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad creds"));

        assertThrows(com.Task.employeeAPI.exceptions.BadCredentialsException.class,
                () -> employeeService.login(login));
    }

    // -----------------------------------------------------
    // CREATE EMPLOYEE
    // -----------------------------------------------------

    @Test
    void createEmployee_success() {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("123");
        dto.setRole(Role.EMPLOYEE);

        when(employeeRepository.findByEmailAndIsDeletedFalse("test@example.com"))
                .thenReturn(null);

        // DTO -> Entity
        Employee mapped = new Employee();
        mapped.setPassword("123");

        when(modelMapper.map(dto, Employee.class)).thenReturn(mapped);

        // encode password
        when(passwordEncoder.encode("123")).thenReturn("encoded");

        // save just возвращает того же employee
        when(employeeRepository.save(mapped)).thenReturn(mapped);

        // Entity -> DTO (ВАЖНО: именно mapped, а не saved)
        when(modelMapper.map(mapped, EmployeeDTO.class)).thenReturn(dto);

        // Act
        EmployeeDTO result = employeeService.createEmployee(dto);

        // Assert
        assertEquals("test@example.com", result.getEmail());
        assertEquals("encoded", mapped.getPassword()); // доп. проверка, что пароль заэнкодился
    }


    @Test
    void createEmployee_nullInput_throws() {
        assertThrows(BadRequestException.class, () -> employeeService.createEmployee(null));
    }

    @Test
    void createEmployee_duplicateEmail_throws() {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmail("test@example.com");

        when(employeeRepository.findByEmailAndIsDeletedFalse("test@example.com"))
                .thenReturn(new Employee());

        assertThrows(BadRequestException.class, () -> employeeService.createEmployee(dto));
    }

    // -----------------------------------------------------
    // FIND BY ID
    // -----------------------------------------------------

    @Test
    void findEmployeeById_success() {
        Employee emp = new Employee();
        emp.setId(1);

        EmployeeDTO mapped = new EmployeeDTO();
        mapped.setId(1);

        when(employeeMapper.findEmployeeById(1)).thenReturn(emp);
        when(modelMapper.map(emp, EmployeeDTO.class)).thenReturn(mapped);

        EmployeeDTO result = employeeService.findEmployeeById(1);

        assertEquals(1, result.getId());
    }

    @Test
    void findEmployeeById_notFound_throws() {
        when(employeeMapper.findEmployeeById(1)).thenReturn(null);

        assertThrows(NotFoundException.class, () ->
                employeeService.findEmployeeById(1));
    }

    // -----------------------------------------------------
    // FIND ALL
    // -----------------------------------------------------

    @Test
    void findAllEmployees_success() {
        when(employeeRepository.findByIsDeletedFalse())
                .thenReturn(List.of(new Employee(), new Employee()));

        when(modelMapper.map(any(Employee.class), eq(EmployeeDTO.class)))
                .thenReturn(new EmployeeDTO());

        List<EmployeeDTO> list = employeeService.findAll();

        assertEquals(2, list.size());
    }

    // -----------------------------------------------------
    // DELETE EMPLOYEE
    // -----------------------------------------------------

    @Test
    void deleteEmployee_success() {
        Employee emp = new Employee();
        emp.setId(1);

        Task t = new Task();
        t.setId(10);

        when(employeeRepository.findById(1)).thenReturn(Optional.of(emp));
        when(taskRepository.findByEmployee_id(1)).thenReturn(List.of(t));
        when(taskWorkflowRepository.findByTask_Id(10))
                .thenReturn(List.of(new TaskWorkflow()));

        when(modelMapper.map(emp, EmployeeDTO.class))
                .thenReturn(new EmployeeDTO());

        EmployeeDTO out = employeeService.deleteEmployeeById(1);

        assertNotNull(out);
        verify(taskWorkflowRepository).deleteAll(any());
        verify(taskRepository).deleteById(10);
        verify(employeeRepository).save(emp);
    }

    @Test
    void deleteEmployee_notFound_throws() {
        when(employeeRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> employeeService.deleteEmployeeById(1));
    }

    // -----------------------------------------------------
    // UPDATE EMPLOYEE
    // -----------------------------------------------------

    @Test
    void updateEmployee_success() {
        EmployeeUpdateDTO dto = new EmployeeUpdateDTO();
        dto.setName("New");
        dto.setSurname("User");

        Employee emp = new Employee();
        emp.setId(1);
        emp.setEmail("old@example.com");

        when(employeeRepository.findByIdAndIsDeletedFalse(1))
                .thenReturn(Optional.of(emp));

        EmployeeDTO mapped = new EmployeeDTO();
        mapped.setName("New");
        mapped.setSurname("User");

        when(modelMapper.map(emp, EmployeeDTO.class))
                .thenReturn(mapped);

        EmployeeDTO result = employeeService.updateEmployeeById(1, dto);

        assertEquals("New", result.getName());
        assertEquals("User", result.getSurname());
    }

    @Test
    void updateEmployee_nullInput_throws() {
        assertThrows(BadRequestException.class,
                () -> employeeService.updateEmployeeById(1, null));
    }

    @Test
    void updateEmployee_notFound_throws() {
        when(employeeRepository.findByIdAndIsDeletedFalse(1))
                .thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> employeeService.updateEmployeeById(1, new EmployeeUpdateDTO()));}
}
