import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userName: string = 'John Doe'; // Example user name

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  // Logout method
  logout() {
    this.authService.logout(); // Call logout from AuthService
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
