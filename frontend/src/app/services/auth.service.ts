import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface AuthResponse {
  token: string;
  username: string;
  firstName: string;
  lastName: string;
  userId: number;
}

export interface UserData {
  username: string;
  firstName: string;
  lastName: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserData | null>(
    this.getStoredUser()
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): UserData | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(tap((response) => this.handleAuthentication(response)));
  }

  register(userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(tap((response) => this.handleAuthentication(response)));
  }

  private handleAuthentication(authResponse: AuthResponse): void {
    const userData: UserData = {
      username: authResponse.username,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      userId: authResponse.userId,
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('token', authResponse.token);
    this.currentUserSubject.next(userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.userId : null;
  }
}
