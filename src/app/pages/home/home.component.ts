import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {StateService} from "../../services/state.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly stateSvc: StateService) {
    this.isLoggedIn$ = this.stateSvc.getIsLoggedIn()
  }
}
