import {Component, OnInit} from '@angular/core';
import {PresenceService} from "../../services/presence.service";
import {Observable} from "rxjs";
import {Presence} from "../../models/presence";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";
import {StateService} from "../../services/state.service";
import {PresenceStatus} from "../../../util/enum";

@Component({
  selector: 'app-presences',
  templateUrl: './presences.component.html',
  styleUrl: './presences.component.css'
})
export class PresencesComponent implements OnInit {
  userRole$: Observable<string>;
  presenceStatus: Observable<PresenceStatus>
  presences: Presence[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private readonly authService: AuthService,
    private readonly presenceSvc: PresenceService,
    private modalService: NgbModal,
    private readonly notificationService: NotificationService,
    private readonly stateSvc: StateService,
  ) {
    this.presenceStatus = this.stateSvc.getPresenceStatus()
    this.userRole$ = this.stateSvc.getUserRole();
    this.stateSvc.getUserRole().subscribe(value => console.log('this.stateSvc.getUserRole(): ', value))
  }

  ngOnInit(): void {
    this.presenceSvc.checkStatus()
    this.loadPresences()
  }

  loadPresences(): void {
    this.presenceSvc.getPresences().subscribe({
      next: (response: any) => {
        if (response.success == 1) {
          this.presences = response.data.map((item: any) => ({
            presenceId: item.presence_id,
            userId: item?.user?.id,
            checkIn: item?.check_in,
            checkOut: item?.check_out,
            checkInCoordinates: item?.check_in_coordinate,
            checkOutCoordinates: item?.check_out_coordinate,
            Employee: {
              employeeId: item?.employee?.id,
              name: item?.employee?.name,
              job_role: item?.employee?.job_role
            }
          }))
        } else {
          console.error('Get presences failed', response.message);
          this.notificationService.showError(response.message);
        }
      },
      error: (err) => {
        console.error('Get presences failed', err);
        this.notificationService.showError(err.error.message);
      }
    });
  }

  protected readonly PresenceStatus = PresenceStatus;
}
