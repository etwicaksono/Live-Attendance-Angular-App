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
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string>;
  initialName: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userRole$ = this.authService.userRole$;
  }

  ngOnInit(): void {
    this.authService.getUserProfile().then((userProfile) => {
      this.initialName = this.getInitials(userProfile.name);
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

  getInitials(fullName: string): string {
    if (!fullName) return '';

    // Split the full name into words
    const names = fullName.split(' ');

    // Get the first letter of each word and join them
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');

    return initials.substring(0, 2); // Return only the first two initials
  }
}
