import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";
import {UserResponseDto} from "../dto/user-response.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject to hold the current state of login
  private readonly loggedIn = new BehaviorSubject<boolean>(false);

  // Observable for other components to subscribe to
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private readonly http: HttpClient,
  ) {
    const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
    this.loggedIn.next(isLoggedIn);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiURl}/auth/login`, {username, password})
      .pipe(
        tap((response: any) => {
          if (response.success == 1) {
            this.loggedIn.next(true);
            localStorage.setItem('token', `Bearer ${response.data.token}`);  // Save the token in localStorage
          }
        })
      );
  }

  logout(): Observable<any> {
    const bearerToken = localStorage.getItem('token')
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    return this.http.post(`${environment.apiURl}/auth/logout`, null, {headers: {'Authorization': `Bearer ${bearerToken}`}});
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to get the user profile data
  async getUserProfile(): Promise<UserResponseDto> {
    const user = localStorage.getItem('user')
    let userData = new UserResponseDto()

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
