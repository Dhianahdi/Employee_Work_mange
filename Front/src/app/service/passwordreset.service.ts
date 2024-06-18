// password-reset.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`${baseUrl}/requestPasswordReset`, body);
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const body = { token, newPassword };
    return this.http.post(`${baseUrl}/resetPassword`, body);
  }
}
