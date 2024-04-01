import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class User {
  name!: string;
  id_number!: string;
  email!: string;
  type!: string;
  contact!: string;
  password_confirmation!: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  // User registration
  register(user: User): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/auth/register', user);
  }
  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/auth/login', user);
  }
  // Access user profile
  profileUser(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/auth/user-profile');
  }
}
