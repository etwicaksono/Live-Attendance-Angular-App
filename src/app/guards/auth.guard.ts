import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      if (state.url === '/login') {
        this.router.navigate(['/dashboard'])
      }
      return true
    } else {
      if (state.url === '/login') {
        return true
      }
      this.router.navigate(['/login'])
      return true
    }
  }
}
