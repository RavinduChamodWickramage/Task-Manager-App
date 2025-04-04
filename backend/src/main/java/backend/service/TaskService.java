package backend.service;

import backend.dto.TaskDTO;
import backend.entity.Task;
import backend.entity.User;
import backend.enums.TaskStatus;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public List<TaskDTO> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId)
                .stream()
                .map(task -> modelMapper.map(task, TaskDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<TaskDTO> getTaskByIdAndUserId(Long taskId, Long userId) {
        return taskRepository.findByIdAndUserId(taskId, userId)
                .map(task -> modelMapper.map(task, TaskDTO.class));
    }

    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = modelMapper.map(taskDTO, Task.class);
        task.setUser(user);
        Task savedTask = taskRepository.save(task);
        return modelMapper.map(savedTask, TaskDTO.class);
    }

    @Transactional
    public TaskDTO updateTask(TaskDTO taskDTO, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskDTO.getId(), userId)
                .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));
        modelMapper.map(taskDTO, task);
        Task updatedTask = taskRepository.save(task);
        return modelMapper.map(updatedTask, TaskDTO.class);
    }

    @Transactional
    public TaskDTO updateTaskStatus(Long taskId, Long userId, TaskStatus isCompleted) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));

        task.setStatus(isCompleted);
        Task updatedTask = taskRepository.save(task);

        return modelMapper.map(updatedTask, TaskDTO.class);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));
        taskRepository.delete(task);
    }
}
