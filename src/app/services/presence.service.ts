import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environment/environment";
import {NotificationService} from "./notification.service";
import {constant} from "../../util/constant";
import {PresenceStatus} from "../../util/enum";
import {StateService} from "./state.service";
import {Presence} from "../models/presence";

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

  checkIn(presence: Presence): Observable<Presence> {
    const formData = new FormData();
    /*formData.append('employeeId', presence.employeeId?.toString() || '');
    formData.append('presenceTypeId', presence.presenceTypeId?.toString() || '');*/
    formData.append('coordinates', presence.checkInCoordinates || '');
    presence.checkInImages?.forEach((file, index) => {
      formData.append('images', file, file.name);
    });

    return this.http.post<Presence>(`${environment.apiURl}/presence/checkin`, formData).pipe(
      catchError(this.handleError)
    );
  }

  checkOut(presence: Presence): Observable<Presence> {
    const formData = new FormData();
    // formData.append('employeeId', presence.employeeId?.toString() || '');
    // formData.append('presenceTypeId', presence.presenceTypeId?.toString() || '');
    // formData.append('coordinates', presence.checkOutCoordinates || '');
    presence.checkOutImages?.forEach((file, index) => {
      formData.append('photo', file, file.name);
    });

    return this.http.post<Presence>(`${environment.apiURl}/presence/checkout`, formData).pipe(
      catchError(this.handleError)
    );
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

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError(error);
  }
}
