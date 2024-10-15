import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "./services/notification.service";
import {StateService} from "./services/state.service";
import {UtilService} from "./services/util.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string>;
  initialName: Observable<string>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly stateSvc: StateService,
    private readonly utilSvc: UtilService,
  ) {
    this.isLoggedIn$ = this.stateSvc.getIsLoggedIn()
    this.userRole$ = this.stateSvc.getUserRole();
    this.initialName = this.stateSvc.getInitialName();
  }

  ngOnInit(): void {
    this.authService.getEmployeeProfile().then((userProfile) => {
      if (userProfile) {
        this.stateSvc.setInitialName(this.utilSvc.getInitials(userProfile.name));
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.showSuccess('Logout successful');
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.notificationService.showError(err.error.message);
        // Optionally show an error message to the user
      }
    }); // Call logout from AuthService
    this.router.navigate(['']); // Redirect to login page after logout
  }
}
