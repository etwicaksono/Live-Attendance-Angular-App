import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NotificationDialogComponent} from "./components/notification-dialog/notification-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {
    // Initialize the isLoggedIn$ property in the constructor
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    // Subscribe to the global auth state
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.openDialog('Logout successful');
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.openDialog(err.error.message);
        // Optionally show an error message to the user
      }
    }); // Call logout from AuthService
    this.router.navigate(['']); // Redirect to login page after logout
  }

  openDialog(message: string) {
    this.dialog.open(NotificationDialogComponent, {
      data: {message}
    });
  }
}
