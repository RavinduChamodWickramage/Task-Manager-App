import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';
import { RouterModule } from '@angular/router';
import { TaskStatusPipe } from '../../shared/pipes/task-status.pipe';

@Component({
  selector: 'app-task-card',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    TaskStatusPipe,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{
    id: number;
    status: TaskStatus;
  }>();

  TaskStatus = TaskStatus;

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit(this.task.id);
  }

  onStatusChange(status: TaskStatus): void {
    if (this.task.id) {
      this.statusChange.emit({ id: this.task.id, status });
    }
  }

  getStatusClass(): string {
    switch (this.task.status) {
      case TaskStatus.NOT_STARTED:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
