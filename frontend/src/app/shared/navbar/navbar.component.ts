import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isMenuOpen = false;
  user: any;
  private userSub: Subscription;

  constructor(public authService: AuthService, private router: Router) {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }

  get userInitials(): string {
    return this.user
      ? `${this.user.firstName?.charAt(0) || ''}${
          this.user.lastName?.charAt(0) || ''
        }`
      : '';
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
