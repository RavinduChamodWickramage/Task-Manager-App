import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskStatusPipe } from '../../shared/pipes/task-status.pipe';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, TaskStatusPipe, AlertComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  taskStatuses = Object.values(TaskStatus);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTask(this.taskId);
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      status: [TaskStatus.NOT_STARTED, Validators.required],
      dueDate: [''],
    });
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          status: task.status,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split('T')[0]
            : '',
        });
        this.loading = false;
      },
      error: (err) => {
        this.error =
          "Failed to load task. It might have been deleted or you don't have permission to view it.";
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData: Task = {
      ...this.taskForm.value,
    };

    this.submitting = true;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask({ ...taskData, id: this.taskId }).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.error = 'Failed to update task. Please try again.';
          this.submitting = false;
        },
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.error = 'Failed to create task. Please try again.';
          this.submitting = false;
        },
      });
    }
  }
}
