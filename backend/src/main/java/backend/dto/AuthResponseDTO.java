package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String username;
    private String firstName;
    private String lastName;
}
