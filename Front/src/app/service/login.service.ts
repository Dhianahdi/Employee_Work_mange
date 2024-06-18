import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';
import baseUrl from './helper';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  // Generate token
  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/authenticate`, loginData, {
      headers: this.requestHeader,
    }).pipe(
      tap((response: any) => {
        console.log('Token Response:', response);

        // Set user information
        this.userAuthService.setUser(response.user);
        this.userAuthService.setRoles(response.roles);

        // You can also set other user-related information here if needed
      })
    );
  }

  // Get JWT token
  public getToken(): string {
    return this.userAuthService.getToken() ?? '';
  }

  // Update user information
  public updateUser(updatedUser: any) {
    const token = this.getToken();
    if (!token) {
      return throwError('Token is missing or expired');
    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });

    return this.http.put(`${baseUrl}/user/update`, updatedUser, { headers });
  }

  // Check if user roles match allowed roles
  public roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();

    console.log('Allowed Roles:', allowedRoles);
    console.log('User Roles:', userRoles);

    if (userRoles != null && userRoles) {
      for (const userRole of userRoles) {
        for (const allowedRole of allowedRoles) {
          if (userRole.roleName === allowedRole) {
            // Role match found, set isMatch to true and break out of the loop
            isMatch = true;
            break;
          }
        }
        // If a match is found, no need to continue checking other roles
        if (isMatch) {
          break;
        }
      }
    }

    return isMatch; // Default return statement
  }
}
