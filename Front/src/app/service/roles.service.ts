import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  // Fetch roles from backend
  public getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/roles`);
  }

  // Create a new role
  public createRole(role: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/roles/createRole`, role);
  }

  // Update role description
  public updateRole(roleId: number, newRoleData: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/roles/${roleId}`, newRoleData);
  }

  // Delete a role
  public deleteRole(roleId: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/roles/${roleId}`);
  }

  // Get role by name
  public getRoleByName(roleName: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/roles/${roleName}`);
  }
}
