import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private readonly authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Handle successful login (e.g., navigate to dashboard)
        console.log('Login successful', response);
      },
      (error) => {
        // Handle error (e.g., show error message)
        console.error('Login failed', error);
      }
    );
  }

}
