import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
