import {Injectable} from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiURl}/auth/login`, {username, password})
      .pipe(
        tap((response: any) => {
          if (response.success == 1) {
            localStorage.setItem('token', `Bearer ${response.data.token}`);  // Save the token in localStorage
          }
        })
      );
  }

  logout(): Observable<any> {
    const bearerToken = localStorage.getItem('token')
    localStorage.removeItem('token');
    return this.http.post(`${environment.apiURl}/auth/logout`, null, {headers: {'Authorization': `Bearer ${bearerToken}`}});
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
