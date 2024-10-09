import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NotificationDialogComponent} from "../../components/notification-dialog/notification-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userName: string = 'John Doe'; // Example user name

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {
  }

  // Logout method
  logout() {
    this.authService.logout(); // Call logout from AuthService
    this.openDialog('Logout successful'); // Show notification
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  openDialog(message: string) {
    this.dialog.open(NotificationDialogComponent, {
      data: {message}
    });
  }
}
