import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {environment} from "../../environment/environment";
import {NotificationService} from "./notification.service";
import {Presence} from "../models/presence";

@Injectable({
  providedIn: 'root'
})

export class PresenceService {
  // BehaviorSubject to hold the current state of presence status
  private readonly presenceStatus = new BehaviorSubject<PresenceStatus>(PresenceStatus.NEED_CHECK_IN);

  // Observable for other components to subscribe to
  public presenceStatus$ = this.presenceStatus.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly authSvc: AuthService,
    private readonly notificationService: NotificationService,
  ) {
  }

  checkStatus(): PresenceStatus {
    type PresenceStatusKey = keyof typeof PresenceStatus;
    let presenceStatus: PresenceStatus = PresenceStatus.NEED_CHECK_IN
    const bearerToken = localStorage.getItem(this.authSvc.tokenKey)

    this.http.get(`${environment.apiURl}/presence/check-status`, {headers: {'Authorization': `Bearer ${bearerToken}`}}).subscribe({
      next: (response: any) => {
        if (response.success == 1) {
          this.presenceStatus.next(response.data.status);
        } else {
          console.error('Presence status checking failed', response.message);
          this.notificationService.showError(response.message);
        }
      },
      error: (err) => {
        console.error('Presence status checking failed', err);
        this.notificationService.showError(err.error.message);
      }
    })

    return presenceStatus ? PresenceStatus[presenceStatus as PresenceStatusKey] : PresenceStatus.NEED_CHECK_IN
  }


  getPresences(): Observable<any> {
    const bearerToken = localStorage.getItem(this.authSvc.tokenKey)
    return this.http.get(`${environment.apiURl}/presence/list`, {headers: {'Authorization': `Bearer ${bearerToken}`}})
  }
}

export enum PresenceStatus {
  NEED_CHECK_IN = 'NEED_CHECK_IN',
  NEED_CHECK_OUT = 'NEED_CHECK_OUT',
  CHECKED_OUT = 'CHECKED_OUT'
}
