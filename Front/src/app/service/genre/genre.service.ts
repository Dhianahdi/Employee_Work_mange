import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }

  // Fetch all genres
  getAllGenres(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/genres`);
  }

  // Fetch a genre by its ID
  getGenreById(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/genres/${id}`);
  }

  // Create a new genre
  createGenre(genre: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/genres`, genre);
  }

  // Update an existing genre by ID
  updateGenre(id: number, genre: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/genres/${id}`, genre);
  }

  // Delete a genre by ID
  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/genres/${id}`);
  }
}
