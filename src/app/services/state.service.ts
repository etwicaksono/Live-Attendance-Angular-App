import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {constant} from "../../util/constant";
import {PresenceStatus} from "../../util/enum";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() {
  }

  private readonly isLoggedIn = new BehaviorSubject<boolean>(false);
  private readonly userRole = new BehaviorSubject<string>('default');
  private readonly initialName = new BehaviorSubject<string>('U');
  private readonly presenceStatus = new BehaviorSubject<PresenceStatus>(PresenceStatus.NEED_CHECK_IN);

  // User's Login State
  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  setIsLoggedIn(loggedIn: boolean): void {
    this.isLoggedIn.next(loggedIn);
  }

  // User's Role
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

  // Initial name
  getInitialName(): Observable<string> {
    return this.initialName.asObservable();
  }

  setInitialName(initialName: string): void {
    this.initialName.next(initialName);
  }

  // Presence status
  getPresenceStatus(): Observable<PresenceStatus> {
    return this.presenceStatus.asObservable();
  }

  setPresenceStatus(presenceStatus: PresenceStatus): void {
    this.presenceStatus.next(presenceStatus);
  }
}
