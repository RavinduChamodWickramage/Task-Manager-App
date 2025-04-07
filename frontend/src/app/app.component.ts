import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Router,
  RouterModule,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Task Manager';

  constructor(public router: Router) {}
}
