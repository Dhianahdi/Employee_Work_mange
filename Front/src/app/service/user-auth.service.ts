// Import necessary modules and decorators from Angular core and RxJS
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Marks this service as injectable and ensures a single instance in the root module
})
export class UserAuthService {
  // Define a Subject to hold user information and notify subscribers of changes
  private userSubject = new Subject<any>();

  constructor() { }

  // Save user roles to localStorage
  public setRoles(roles: string[]) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  // Retrieve user roles from localStorage
  public getRoles(): string[] {
    const rolesString = localStorage.getItem("roles");
    const roles = rolesString ? JSON.parse(rolesString) : [];
    console.log("Roles retrieved:", roles);
    return roles;
  }

  // Save user information to localStorage and notify subscribers
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user); // Notify subscribers about the user update
  }

  // Provide an observable for subscribers to listen to user changes
  public getUserObservable() {
    return this.userSubject.asObservable();
  }

  // Retrieve user information from localStorage
  public getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr != null ? JSON.parse(userStr) : null;
  }

  // Save JWT token to localStorage
  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken);
  }

  // Retrieve JWT token from localStorage
  public getToken(): string {
    // Use the nullish coalescing operator (??) to provide an empty string as the default value
    return localStorage.getItem('jwtToken') ?? '';
  }

  // Check if the user is logged in by verifying roles and token
  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  // Clear all stored data from localStorage
  public clear() {
    localStorage.clear();
  }
}
