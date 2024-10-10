import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NotificationDialogComponent} from './components/notification-dialog/notification-dialog.component';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        NotificationDialogComponent,
        ProfileComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogContent,
        MatDialogActions,
    ],
    providers: [
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
