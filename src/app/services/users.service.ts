import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { AuthenticationResponse } from '../models/authentication-response';
import { Register } from '../models/register';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersAPIURL: string = environment.usersAPIURL;

  public isAuthenticated: boolean = false;
  public isAdmin: boolean = false;
  public currentUserName: string | null = "";
  public authResponse: AuthenticationResponse | null = null;

  private isBrowser: boolean = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Only load from localStorage in browser
    if (this.isBrowser) {
      this.loadFromStorage();
    }
  }

  // ✅ Load persisted auth state safely
  private loadFromStorage(): void {
    this.isAuthenticated = !!localStorage.getItem('authToken');

    const isAdminValue = localStorage.getItem('isAdmin');
    this.isAdmin =
      isAdminValue !== null &&
      isAdminValue !== undefined &&
      isAdminValue.toLowerCase() === 'true';

    this.currentUserName = localStorage.getItem('currentUserName');

    const authResponse = localStorage.getItem('authResponse');
    if (authResponse) {
      this.authResponse = JSON.parse(authResponse);
    }
  }

  // ✅ Register API
  register(register: Register): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.usersAPIURL}auth/register`,
      register
    );
  }

  // ✅ Login API (with admin shortcut)
  login(email: string, password: string): Observable<AuthenticationResponse> {
    if (email === 'admin@example.com' && password === 'admin') {
      const adminUser: AuthenticationResponse = {
        userID: 'admin_id',
        personName: 'Admin',
        email: 'admin@example.com',
        gender: 'male',
        token: 'admin_token',
        success: true,
      };

      return of(adminUser);
    } else {
      return this.http.post<AuthenticationResponse>(
        `${this.usersAPIURL}auth/login`,
        { email, password }
      );
    }
  }

  // ✅ Set auth state safely
  setAuthStatus(
    authResponse: AuthenticationResponse,
    token: string,
    isAdmin: boolean,
    currentUserName: string
  ): void {
    this.isAuthenticated = true;
    this.isAdmin = isAdmin;
    this.currentUserName = currentUserName;
    this.authResponse = authResponse;

    if (this.isBrowser) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('isAdmin', isAdmin.toString());
      localStorage.setItem('currentUserName', currentUserName);
      localStorage.setItem('authResponse', JSON.stringify(authResponse));
    }
  }

  // ✅ Logout safely
  logout(): void {
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.currentUserName = null;
    this.authResponse = null;

    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('currentUserName');
      localStorage.removeItem('authResponse');
    }
  }
}