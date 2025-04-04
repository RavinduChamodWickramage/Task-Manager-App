package backend.controller;

import backend.dto.AuthRequestDTO;
import backend.dto.AuthResponseDTO;
import backend.dto.RegisterRequestDTO;
import backend.dto.UserDTO;
import backend.service.AuthService;
import backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO authRequest) {
        String token = authService.authenticateUser(authRequest.getUsername(), authRequest.getPassword());
        UserDTO user = userService.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                new AuthResponseDTO(
                        token,
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getId()
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName(registerRequest.getFirstName());
        userDTO.setLastName(registerRequest.getLastName());
        userDTO.setUsername(registerRequest.getUsername());
        userDTO.setPassword(registerRequest.getPassword());

        UserDTO registeredUser = userService.registerUser(userDTO);
        String token = authService.authenticateUser(registerRequest.getUsername(), registerRequest.getPassword());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponseDTO(
                        token,
                        registeredUser.getUsername(),
                        registeredUser.getFirstName(),
                        registeredUser.getLastName(),
                        registeredUser.getId()
                )
        );
    }
}
