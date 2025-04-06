import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
@Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Input() autoClose: boolean = false;
  @Input() duration: number = 5000;

  isVisible: boolean = true;

  ngOnInit(): void {
    if (this.autoClose) {
      setTimeout(() => {
        this.isVisible = false;
      }, this.duration);
    }
  }

  dismiss(): void {
    this.isVisible = false;
  }

  getAlertClass(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-400';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-400';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-400';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-400';
    }
  }

  getIconClass(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
      default:
        return 'text-blue-400';
    }
  }
}
