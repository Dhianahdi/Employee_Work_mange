import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root'
})
export class UserImageService {

  constructor(private http: HttpClient) { }

  // Method to upload image
  public uploadImage(username: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${baseUrl}/image/upload/${username}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Method to delete image
  public deleteImage(id: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/image/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to fetch image by ID
  public getImageById(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/image/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to fetch images by username
  public getImagesByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/image/user/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to fetch the actual image file content by ID
  public getImageFile(id: number): Observable<Blob> {
    return this.http.get(`${baseUrl}/image/file/${id}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to fetch all images
  public getAllImages(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/image/all`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
