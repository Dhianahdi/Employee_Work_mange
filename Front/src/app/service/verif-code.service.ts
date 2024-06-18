
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class VerifCodeService {

  constructor(private http: HttpClient) {}

  sendVerificationCode(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`${baseUrl}/sendVerificationCode`, body);
  }

  verifyVerificationCode(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post<any>(`${baseUrl}/verifyVerificationCode`, body); // Replace environment.baseUrl with your actual base URL
  }
}
