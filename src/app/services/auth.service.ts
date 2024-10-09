import {Injectable} from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api/auth/login';  // Replace with your backend URL

  constructor(private readonly http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, {username, password})
      .pipe(
        tap((response: any) => {
          if (response.success == 1) {
            localStorage.setItem('token', response.data.token);  // Save the token in localStorage
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
