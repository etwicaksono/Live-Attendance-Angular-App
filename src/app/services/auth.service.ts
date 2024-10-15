import {Injectable} from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";
import {UserResponseDto} from "../dto/user-response.dto";
import {toZonedTime} from 'date-fns-tz';
import {NotificationService} from "./notification.service";
import {StateService} from "./state.service";
import {constant} from "../../util/constant";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService,
    private readonly stateSvc: StateService,
  ) {
    const isLoggedIn = this.isLoggedIn()
    this.stateSvc.setIsLoggedIn(isLoggedIn);
  }


  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiURl}/auth/login`, {username, password})
      .pipe(
        tap((response: any) => {
          if (response.success == 1) {
            this.stateSvc.setIsLoggedIn(true);
            this.stateSvc.setUserRole(response.data.role);
            localStorage.setItem(constant.localStorageKey.token, `Bearer ${response.data.token}`)
            localStorage.setItem(constant.localStorageKey.tokenExpiredAt, response.meta.expired_at)
            localStorage.setItem(constant.localStorageKey.tokenRefreshableTill, response.meta.refreshable_till)
          }
        })
      );
  }

  refreshToken(): Observable<any> {
    const bearerToken = localStorage.getItem(constant.localStorageKey.token)
    return this.http.post(`${environment.apiURl}/auth/refresh-token`, null, {headers: {'Authorization': `Bearer ${bearerToken}`}})
      .pipe(
        tap((response: any) => {
          if (response.success == 1) {
            this.stateSvc.setIsLoggedIn(true);
            this.stateSvc.setUserRole(response.data.role);
            localStorage.setItem(constant.localStorageKey.token, `Bearer ${response.data.token}`)
            localStorage.setItem(constant.localStorageKey.tokenExpiredAt, response.meta.expired_at)
            localStorage.setItem(constant.localStorageKey.tokenRefreshableTill, response.meta.refreshable_till)
          }
        })
      );
  }

  logout(): Observable<any> {
    const bearerToken = localStorage.getItem(constant.localStorageKey.token)
    localStorage.removeItem(constant.localStorageKey.token);
    localStorage.removeItem(constant.localStorageKey.tokenExpiredAt);
    localStorage.removeItem(constant.localStorageKey.tokenRefreshableTill);
    localStorage.removeItem(constant.localStorageKey.employee);
    this.stateSvc.setIsLoggedIn(false);
    this.stateSvc.setUserRole(constant.userRole.default);
    return this.http.post(`${environment.apiURl}/auth/logout`, null, {headers: {'Authorization': `Bearer ${bearerToken}`}});
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    // Get the current time in UTC
    const currentTime = new Date();
    const currentTimeUTC = toZonedTime(currentTime, 'UTC');
    // Get expired time in UTC
    const storedExpiredAuth = localStorage.getItem(constant.localStorageKey.tokenExpiredAt)
    const storedExpiredAuthUTC = toZonedTime(new Date(`${storedExpiredAuth}Z`), 'UTC'); // Append 'Z' to indicate it's UTC
    // Get refreshable time in UTC
    const storedRefreshable = localStorage.getItem(constant.localStorageKey.tokenRefreshableTill)
    const storedRefreshableUTC = toZonedTime(new Date(`${storedRefreshable}Z`), 'UTC'); // Append 'Z' to indicate it's UTC

    // When token is expired
    if (currentTimeUTC > storedExpiredAuthUTC) {
      // When token is refreshable
      if (storedRefreshableUTC > currentTimeUTC) {
        // Refresh token
        console.log('Token is expired, refresh token');
        this.refreshToken().subscribe({
          next: () => {
            this.notificationService.showSuccess('Token refreshed');
          },
          error: (err) => {
            console.error('Refresh token failed', err);
            this.notificationService.showError(err.error.message);
            this.logout().subscribe({
              next: () => {
                this.notificationService.showSuccess('Logout successful');
              },
              error: (err) => {
                console.error('Logout failed', err);
                this.notificationService.showError(err.error.message);
              }
            })
          }
        })
      } else {
        // Do logout
        console.log('Token is expired, do logout');
        this.logout().subscribe({
          next: () => {
            this.notificationService.showSuccess('Logout successful');
          },
          error: (err) => {
            console.error('Logout failed', err);
            this.notificationService.showError(err.error.message);
          }
        })
      }
    }

    return !!localStorage.getItem(constant.localStorageKey.token);
  }

  // Method to get the user profile data
  async getEmployeeProfile(): Promise<UserResponseDto> {
    const employee = localStorage.getItem(constant.localStorageKey.employee)
    let userData = new UserResponseDto()

    if (employee) {
      console.debug('retrieve employee profile data from localstorage')
      userData = JSON.parse(employee);
    } else {
      console.debug('retrieve employee profile data from api')
      const bearerToken = localStorage.getItem(constant.localStorageKey.token)
      await this.http.get(`${environment.apiURl}/my-profile`, {headers: {'Authorization': `Bearer ${bearerToken}`}})
        .pipe(
          tap((response: any) => {
            if (response.success == 1) {
              localStorage.setItem(constant.localStorageKey.employee, JSON.stringify(response.data));  // Save the token in localStorage
              userData = response.data
            } else {
              this.notificationService.showError(response.message);
            }
          }),
          catchError((error: any, caught: Observable<any>): any => {
            // Handle the error here
            console.error('An error occurred:', error);
            this.notificationService.showError(error.error.message);
          })
        ).toPromise();
    }

    return userData
  }
}
