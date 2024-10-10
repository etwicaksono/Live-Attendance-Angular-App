import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userName: string = '';

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.getUserProfile().then((userProfile) => {
      this.userName = userProfile.name;
    });
  }

  // Fetch user profile data from the AuthService
  async getUserProfile() {
    return await this.authService.getUserProfile();
  }
}
