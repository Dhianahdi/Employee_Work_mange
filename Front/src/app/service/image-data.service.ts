import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import baseUrl from './helper';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {

  constructor(private http: HttpClient, private authService: UserAuthService) { }

   uploadImage(username: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    return this.http.post<any>(`${baseUrl}/userImage/upload/${username}`, formData);
  }

  downloadImage(username: string): Observable<Blob> {
    return this.http.get(`${baseUrl}/userImage/download/${username}`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error(`Error downloading image for user ${username}:`, error);
        return new Observable<Blob>();
      })
    );
  }
}
