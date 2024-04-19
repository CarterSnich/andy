import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private issuer = {
    login: 'http://127.0.0.1:8000/api/auth/login',
    register: 'http://127.0.0.1:8000/api/auth/register',
    validate: 'http://127.0.0.1:8000/api/auth/validate-token',
  };
  constructor(private httpClient: HttpClient) {}
  handleData(token: any) {
    localStorage.setItem('access_token', token);
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  // Verify the token
  isValidToken() {
    let isValid = false;

    this.httpClient.get(this.issuer.validate).subscribe({
      next(data: any) {
        isValid = data['data'];
      },
    });

    return isValid;
  }
  // User state based on valid token
  isLoggedIn() {
    return this.isValidToken();
  }
  // Remove token
  removeToken() {
    localStorage.removeItem('access_token');
  }
}
