import { Component } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  tasks: Task[] = [];
  taskStatus = TaskStatus;
  loading = true;
  user: any;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getTaskCountByStatus(status: TaskStatus): number {
    return this.tasks.filter((task) => task.status === status).length;
  }
}
