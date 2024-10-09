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
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      // If logged in and trying to access login page, redirect to dashboard
      if (next.routeConfig?.path === 'login') {
        this.router.navigate(['/dashboard']);
        return false; // Prevent access to login
      }
      return true; // Allow access to other routes (like dashboard)
    } else {
      // If not logged in, allow access to login
      return true;
    }
  }
}
