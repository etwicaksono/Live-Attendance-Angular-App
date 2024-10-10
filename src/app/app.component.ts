import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "./services/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {
    // Initialize the isLoggedIn$ property in the constructor
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userRole$ = this.authService.userRole$;
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
