import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {ProfileComponent} from './pages/profile/profile.component';
import {HomeComponent} from './pages/home/home.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PresencesComponent} from './pages/presences/presences.component';
import {AuthService} from "./services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    PresencesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Make sure this is imported
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogContent,
    MatDialogActions,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // Position of the notifications
      timeOut: 2000, // Duration in milliseconds
      preventDuplicates: true, // Prevent duplicate notifications
      tapToDismiss: true,               // Dismiss on click
      autoDismiss: true,
    }),
  ],
  providers: [
    provideAnimationsAsync(),
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
