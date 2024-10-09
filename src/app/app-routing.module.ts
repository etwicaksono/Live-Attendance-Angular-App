import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AuthGuard} from "./guards/auth.guard";
import {ProfileComponent} from "./components/profile/profile.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'my-profile', component: ProfileComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
