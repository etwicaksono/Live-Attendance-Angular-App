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

  // Method to get the user profile data
  async getUserProfile() {
    const user = localStorage.getItem('user')
    let userData = {}

    if (user) {
      console.debug('retrieve data from localstorage')
      userData = JSON.parse(user);
    } else {
      console.debug('retrieve data from api')
      const bearerToken = localStorage.getItem('token')
      await this.http.get(`${environment.apiURl}/my-profile`, {headers: {'Authorization': `Bearer ${bearerToken}`}})
        .pipe(
          tap((response: any) => {
            if (response.success == 1) {
              localStorage.setItem('user', JSON.stringify(response.data));  // Save the token in localStorage
              userData = response.data
            }
          })
        ).toPromise();
    }

    return userData
  }
}
