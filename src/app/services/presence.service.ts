import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environment/environment";
import {NotificationService} from "./notification.service";
import {constant} from "../../util/constant";
import {PresenceStatus} from "../../util/enum";
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})

export class PresenceService {

  constructor(
    private readonly http: HttpClient,
    private readonly notifSvc: NotificationService,
    private readonly stateSvc: StateService,
  ) {
  }

  checkStatus(): PresenceStatus {
    type PresenceStatusKey = keyof typeof PresenceStatus;
    let presenceStatus: PresenceStatus = PresenceStatus.NEED_CHECK_IN
    const bearerToken = localStorage.getItem(constant.localStorageKey.token)

    this.http.get(`${environment.apiURl}/presence/check-status`, {headers: {'Authorization': `Bearer ${bearerToken}`}}).subscribe({
      next: (response: any) => {
        if (response.success == 1) {
          this.stateSvc.setPresenceStatus(response.data.status);
        } else {
          console.error('Presence status checking failed', response.message);
          this.notifSvc.showError(response.message);
        }
      },
      error: (err) => {
        console.error('Presence status checking failed', err);
        this.notifSvc.showError(err.error.message);
      }
    })

    return presenceStatus ? PresenceStatus[presenceStatus as PresenceStatusKey] : PresenceStatus.NEED_CHECK_IN
  }


  getPresences(): Observable<any> {
    const bearerToken = localStorage.getItem(constant.localStorageKey.token)
    return this.http.get(`${environment.apiURl}/presence/list`, {headers: {'Authorization': `Bearer ${bearerToken}`}})
  }
}
