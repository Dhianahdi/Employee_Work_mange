import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import baseUrl from './helper';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authService: UserAuthService) {}

  addUser(user: any): Observable<any> {
    return this.http.post(`${baseUrl}/user/registerNewUser`, user);
  }

  public updateUser(updatedUser: any): Observable<any> {
    return this.http.put(`${baseUrl}/user/update`, updatedUser);
  }

  public isEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${baseUrl}/user/checkEmailExists/${email}`);
  }

  public isPhoneExists(phone: string): Observable<boolean> {
    return this.http.get<boolean>(`${baseUrl}/user/phone-exists/${phone}`);
  }

  public isUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${baseUrl}/user/checkUsernameExists/${username}`);
  }

  public changePassword(newPassword: string, confirmPassword: string): Observable<any> {
    if (newPassword !== confirmPassword) {
      return throwError("New password and confirm password do not match");
    }

    const currentUser = this.authService.getUser();
    const username = currentUser.userName;
    const body = {
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };

    return this.http.put(`${baseUrl}/user/changePassword/${username}`, body);
  }

  public verifyOldPassword(oldPassword: string): Observable<boolean> {
    const currentUser = this.authService.getUser();
    const username = currentUser.userName;
    const body = oldPassword;

    return this.http.post<boolean>(`${baseUrl}/user/verifyOldPassword/${username}`, body);
  }

  public getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/user/getallusers`);
  }

  // New methods

  public addGenreToUser(username: string, genreId: number): Observable<any> {
    return this.http.put(`${baseUrl}/user/${username}/addGenre/${genreId}`, {});
  }

  public addGenresToUser(username: string, genreIds: number[]): Observable<any> {
    return this.http.post(`${baseUrl}/user/${username}/genres`, genreIds);
  }

  public removeGenreFromUser(username: string, genreId: number): Observable<any> {
    return this.http.put(`${baseUrl}/user/${username}/removeGenre/${genreId}`, {});
  }

  public addAchievementToUser(username: string, achievementId: number): Observable<any> {
    return this.http.put(`${baseUrl}/user/${username}/addAchievement/${achievementId}`, {});
  }

  public addAchievementsToUser(username: string, achievementIds: number[]): Observable<any> {
    return this.http.post(`${baseUrl}/user/${username}/achievements`, achievementIds);
  }

  public removeAchievementFromUser(username: string, achievementId: number): Observable<any> {
    return this.http.put(`${baseUrl}/user/${username}/removeAchievement/${achievementId}`, {});
  }

  public getUserGenres(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/user/${username}/genres`);
  }
}
