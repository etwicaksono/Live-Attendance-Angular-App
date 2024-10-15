import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {constant} from "../../util/constant";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() {
  }

  // User's Login State
  private readonly loggedIn = new BehaviorSubject<boolean>(false);

  getLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setLoggedIn(loggedIn: boolean): void {
    this.loggedIn.next(loggedIn);
  }

  // User's Role
  private readonly userRole = new BehaviorSubject<string>('default');

  getUserRole(): Observable<string> {
    if (this.userRole.value == constant.userRole.default) {
      //   retrieve data employee from local storage
      const employeeString = localStorage.getItem(constant.localStorageKey.employee);
      if (employeeString) {
        const employeeJson = JSON.parse(employeeString);
        this.userRole.next(employeeJson?.user?.role);
      }
    }
    return this.userRole.asObservable();
  }

  setUserRole(role: string): void {
    this.userRole.next(role);
  }
}
