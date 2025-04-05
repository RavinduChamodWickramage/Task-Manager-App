import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskStatus } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getUserId(): number {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return userId;
  }

  getTasks(): Observable<Task[]> {
    const userId = this.getUserId();
    return this.http.get<Task[]>(`${this.API_URL}?userId=${userId}`);
  }

  getTaskById(taskId: number): Observable<Task> {
    const userId = this.getUserId();
    return this.http.get<Task>(`${this.API_URL}/${taskId}?userId=${userId}`);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const userId = this.getUserId();
    return this.http.post<Task>(`${this.API_URL}?userId=${userId}`, task);
  }

  updateTask(task: Task): Observable<Task> {
    const userId = this.getUserId();
    return this.http.put<Task>(
      `${this.API_URL}/${task.id}?userId=${userId}`,
      task
    );
  }

  updateTaskStatus(taskId: number, status: TaskStatus): Observable<Task> {
    const userId = this.getUserId();
    return this.http.patch<Task>(
      `${this.API_URL}/${taskId}/status?userId=${userId}`,
      { status }
    );
  }

  deleteTask(taskId: number): Observable<void> {
    const userId = this.getUserId();
    return this.http.delete<void>(`${this.API_URL}/${taskId}?userId=${userId}`);
  }
}
