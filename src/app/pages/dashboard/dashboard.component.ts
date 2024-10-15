import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {StateService} from "../../services/state.service";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userName: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly stateSvc: StateService,
    private readonly utilSvc: UtilService,
  ) {
  }

  ngOnInit(): void {
    this.authService.getEmployeeProfile().then((userProfile) => {
      if (userProfile) {
        this.userName = userProfile.name;
        this.stateSvc.setInitialName(this.utilSvc.getInitials(userProfile.name));
      }
    });
  }
}
