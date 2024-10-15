import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = {}; // Object to hold user data

  constructor(private readonly authService: AuthService) {
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  // Fetch user profile data from the AuthService
  async getUserProfile() {
    this.user = await this.authService.getEmployeeProfile();
    console.log(this.user);
  }
}
