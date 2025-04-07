import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskStatusPipe } from '../../shared/pipes/task-status.pipe';
import { RouterModule } from '@angular/router';
import { AlertComponent } from '../../shared/alert/alert.component';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TaskCardComponent, RouterModule, AlertComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  statusFilter = 'ALL';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  showAlert = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks. Please try again later.';
        this.loading = false;
      },
    });
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          this.applyFilters();
          this.showSuccessAlert('Task deleted successfully');
        },
        error: () => {
          this.showErrorAlert('Failed to delete task');
        },
      });
    }
  }

  updateTaskStatus(taskId: number, status: TaskStatus): void {
    this.taskService.updateTaskStatus(taskId, status).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.applyFilters();
          this.showSuccessAlert('Task status updated');
        }
      },
      error: () => {
        this.showErrorAlert('Failed to update task status');
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.tasks];

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          (task.description && task.description.toLowerCase().includes(search))
      );
    }

    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter((task) => task.status === this.statusFilter);
    }

    filtered = filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    this.filteredTasks = filtered;
  }

  showSuccessAlert(message: string): void {
    this.alertMessage = message;
    this.alertType = 'success';
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3000);
  }

  showErrorAlert(message: string): void {
    this.alertMessage = message;
    this.alertType = 'error';
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3000);
  }
}
