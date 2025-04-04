package backend.controller;

import backend.dto.TaskDTO;
import backend.dto.TaskStatusUpdateRequest;
import backend.enums.TaskStatus;
import backend.service.TaskService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasksByUserId(@RequestParam Long userId) {
        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDTO> getTaskById(
            @PathVariable Long taskId,
            @RequestParam Long userId,
            @RequestHeader("Authorization") String token
    ) {
        Optional<TaskDTO> taskOptional = taskService.getTaskByIdAndUserId(taskId, userId);
        return taskOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO, @RequestParam Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        TaskDTO createdTask = taskService.createTask(taskDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long taskId, @RequestBody TaskDTO taskDTO, @RequestParam Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        taskDTO.setId(taskId);
        TaskDTO updatedTask = taskService.updateTask(taskDTO, userId);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam Long userId,
            @Valid @RequestBody TaskStatusUpdateRequest request
    ) {
        TaskDTO updatedTask = taskService.updateTaskStatus(taskId, userId, request.getStatus());
        return ResponseEntity.ok(updatedTask);
    }


    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            @RequestParam Long userId
    ) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}
