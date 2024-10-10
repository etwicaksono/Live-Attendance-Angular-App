import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    // Initialize the isLoggedIn$ property in the constructor
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    // Subscribe to the global auth state
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

}
